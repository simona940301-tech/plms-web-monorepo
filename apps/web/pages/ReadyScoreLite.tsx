import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { logEvent } from '../lib/events';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import useUiStore from '../state/useUiStore';
import useAuthStore from '../state/useAuthStore';
import { addRsAttempt, set_onboarding } from '../lib/db';
import { useNavigate } from 'react-router-dom';

type kind_t = 'vocab' | 'grammar' | 'translation' | 'psych';
type question_t = { id: string; kind: kind_t; stem: string; choices?: string[]; answer?: number };

// 15 items: 12 knowledge + 3 psych
const question_bank: question_t[] = [
  { id: 'q1', kind: 'vocab', stem: "She has a strong ___ in learning languages.", choices: ['ability','capable','capable of','enable'], answer: 0 },
  { id: 'q2', kind: 'vocab', stem: "The manager tried to ___ the problem quickly.", choices: ['solve','solution','solving','solved'], answer: 0 },
  { id: 'q3', kind: 'grammar', stem: "This is the student ___ won the prize yesterday.", choices: ['who','whom','which','whose'], answer: 0 },
  { id: 'q4', kind: 'grammar', stem: "If he ___ harder, he would have passed the test.", choices: ['study','studied','studies','had studied'], answer: 3 },
  { id: 'q5', kind: 'translation', stem: '「雖然他很累，他仍然完成了作業。」', choices: [
    'Even though he was tired, he finished his homework.',
    'He finished his homework unless he was tired.',
    'Despite he tired, he finished his homework.',
    'Because he was tired, he finished his homework.'
  ], answer: 0 },
  { id: 'q6', kind: 'vocab', stem: 'Choose the correct pronoun: Give the book to ___.', choices: ['I','me','myself','my'], answer: 1 },
  { id: 'q7', kind: 'grammar', stem: 'Which sentence is correct?', choices: ['He go to school.','She have a cat.','They are playing.','I is happy.'], answer: 2 },
  { id: 'q8', kind: 'vocab', stem: 'Select the correctly spelled word.', choices: ['neccessary','necesary','necessary','neccesary'], answer: 2 },
  { id: 'q9', kind: 'vocab', stem: 'Bite the bullet means ___.', choices: ['eat something hard','go to dentist','endure a difficult situation','get shot'], answer: 2 },
  { id: 'q10', kind: 'grammar', stem: "Which is correct usage of their/there/they're?", choices: [
    "They're over their, with there dog.",
    "Their over there, with they're dog.",
    "They're over there, with their dog.",
    "There over they're, with their dog."
  ], answer: 2 },
  { id: 'q11', kind: 'translation', stem: '「他說他明天會幫我。」', choices: [
    'He says he helped me tomorrow.',
    'He said he will help me tomorrow.',
    'He said he would help me tomorrow.',
    'He says he would help me tomorrow.'
  ], answer: 2 },
  { id: 'q12', kind: 'translation', stem: '「如果有時間，我會去圖書館。」', choices: [
    'If I have time, I will go to the library.',
    'If I had time, I will go to the library.',
    'If I have time, I would go to the library.',
    'If I had time, I would go to the library.'
  ], answer: 0 },
  { id: 'q13', kind: 'psych', stem: '你的目標校系？（開放填寫）' },
  { id: 'q14', kind: 'psych', stem: '最近一次模考英文分數？（選填數值）' },
  { id: 'q15', kind: 'psych', stem: '你學英文最大的目標是？', choices: ['考上理想校系','分數穩定','建立習慣','減少焦慮','打好基礎'] },
];

type answers_t = { [id: string]: number | string | null };

function compute_seed_rs(res: answers_t) {
  const correct_ratio = (ids: string[]) => {
    const bank = question_bank.filter(q => ids.includes(q.id));
    const correct = bank.reduce((acc, q) => acc + ((res[q.id] as number) === q.answer ? 1 : 0), 0);
    return bank.length ? correct / bank.length : 0;
  };
  const v_ids = question_bank.filter(q => q.kind==='vocab').map(q=>q.id).slice(0,5);
  const g_ids = question_bank.filter(q => q.kind==='grammar').map(q=>q.id).slice(0,4);
  const t_ids = question_bank.filter(q => q.kind==='translation').map(q=>q.id).slice(0,3);
  const v = correct_ratio(v_ids);
  const g = correct_ratio(g_ids);
  const t = correct_ratio(t_ids);
  const w_v = 0.40, w_g = 0.35, w_t = 0.25;
  const p = 100 * (w_v*v + w_g*g + w_t*t);
  const se = 100 * Math.sqrt(Math.pow(w_v,2)*v*(1-v)/5 + Math.pow(w_g,2)*g*(1-g)/4 + Math.pow(w_t,2)*t*(1-t)/3);
  const ci_low = Math.max(0, p - 2*se);
  const ci_high = Math.min(100, p + 2*se);
  const band_center = ((): number => {
    const bands = [
      { lo:35, hi:45 },{ lo:45, hi:55 },{ lo:55, hi:65 },{ lo:65, hi:75 },{ lo:75, hi:85 },{ lo:85, hi:90 },
    ];
    const b = bands.find(b => p >= b.lo && p < b.hi) || bands[bands.length-1];
    return (b.lo + b.hi)/2;
  })();
  const seed = 0.7*p + 0.3*band_center;
  const mock_raw = Number(res['q14'] ?? NaN);
  const mock_norm = isNaN(mock_raw) ? null : Math.max(0, Math.min(100, (mock_raw/150)*100));
  const seed_prime = mock_norm == null ? seed : 0.85*seed + 0.15*mock_norm;
  return { p, ci_low, ci_high, seed: seed_prime, radar: { vocab:v, grammar:g, translation:t } };
}

const ReadyScoreLite: React.FC = () => {
  const navigate = useNavigate();
  const [idx, set_idx] = useState(0);
  const [answers, set_answers] = useState<answers_t>({});
  const [started_at, set_started_at] = useState<number | null>(null);
  const [done, set_done] = useState(false);
  const open_waitlist_modal = useUiStore(s=>s.openWaitlistModal);
  const user = useAuthStore(state => state.user);

  useEffect(() => { set_started_at(Date.now()); logEvent('rs_lite_start'); }, []);
  useEffect(() => {
    if (!user) {
      navigate('/onboarding', { replace: true });
    }
  }, [user, navigate]);

  const current = question_bank[idx];
  const on_choice = (i: number) => {
    const next_idx = idx + 1;
    set_answers(a => ({ ...a, [current.id]: i }));
    setTimeout(() => {
      if (next_idx >= question_bank.length) {
        finish();
      } else {
        set_idx(next_idx);
      }
    }, 150);
  };
  const on_input = (val: string) => set_answers(a => ({ ...a, [current.id]: val }));
  const go_prev = () => set_idx(i=>Math.max(0,i-1));
  const go_next = () => {
    if (idx >= question_bank.length - 1) {
      finish();
    } else {
      set_idx(idx + 1);
    }
  };

  const result = useMemo(() => done ? compute_seed_rs(answers) : null, [done, answers]);
  const finish = async () => {
    if (done) return;
    set_done(true);
    if (started_at){
      const duration_sec = Math.round((Date.now()-started_at)/1000);
      const r = compute_seed_rs(answers);
      logEvent('rs_lite_complete',{duration_sec, seed_rs:Math.round(r.seed), ci_low:Math.round(r.ci_low), ci_high:Math.round(r.ci_high)});
      // Best-effort write to Firestore if configured
      try {
        await addRsAttempt({
          type: 'placement',
          seed_ready_score: r.seed,
          ci_low: r.ci_low,
          ci_high: r.ci_high,
          radar: r.radar,
          raw_p: r.p,
          duration_sec,
          user_id: user?.uid ?? null,
        });
        if (user) {
          await set_onboarding(user.uid, 3, { completed: true, seed_ready_score: r.seed });
        }
      } catch {}
    }
  };

  useEffect(() => {
    if (done && result) {
      logEvent('result_view', { seed_rs: Math.round(result.seed), ci_low: Math.round(result.ci_low), ci_high: Math.round(result.ci_high) });
    }
  }, [done, result]);

  if (done && result) {
    const seed_lo = Math.max(0, Math.round(result.seed - 3));
    const seed_hi = Math.min(100, Math.round(result.seed + 3));
    const motivation_labels = ['考上理想校系','分數穩定','建立習慣','減少焦慮','打好基礎'];
    const motivation_idx = Number(answers['q15']);
    const motivation = Number.isFinite(motivation_idx) ? motivation_labels[motivation_idx] : null;
    return (
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <div className="bg-white dark:bg-background rounded-2xl shadow p-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-2">Ready Score Seed</h2>
          <p className="text-2xl text-muted-foreground mb-4">區間 {seed_lo}–{seed_hi}</p>
          <div className="h-56 w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={[
                { subject:'字彙', v: Math.round(result.radar.vocab*100) },
                { subject:'文法', v: Math.round(result.radar.grammar*100) },
                { subject:'翻譯', v: Math.round(result.radar.translation*100) },
              ]} outerRadius={90}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis domain={[0,100]} />
                <Radar dataKey="v" stroke="#3776A1" fill="#89CFF1" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-secondary rounded-xl p-4 text-left">
            <h3 className="font-semibold mb-1">今日 10 分鐘任務</h3>
            <p className="text-sm text-muted-foreground">3 題文法 + 1 題翻譯 + 1 張錯題（明天持續）</p>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button className="px-6" onClick={()=>logEvent('line_join_click', { seed_rs: Math.round(result.seed) })}>加入 LINE 解鎖完整診斷</Button>
            <Button variant="outline" className="px-6" onClick={()=>{ logEvent('waitlist_submit', { motivation }); open_waitlist_modal(); }}>加入 Waiting List</Button>
          </div>
        </div>
      </div>
    );
  }

  const current = question_bank[idx];
  const progress = Math.round(((idx) / question_bank.length) * 100);
  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <div className="w-full bg-muted rounded-full h-2 mb-6">
        <div className="bg-primary h-2 rounded-full" style={{ width: `${progress}%` }} />
      </div>
      <Card>
        <CardContent>
          <div className="py-8 px-2 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold leading-snug mb-6">{current.stem}</h2>
            {current.kind !== 'psych' && current.choices && (
              <div className="mx-auto max-w-xl space-y-3">
                {current.choices.map((c, i) => (
                  <button key={i} onClick={()=>on_choice(i)} className="w-full py-4 rounded-full bg-accent/80 hover:bg-accent text-foreground font-medium shadow-sm">
                    {c}
                  </button>
                ))}
              </div>
            )}
            {current.id === 'q13' && (
              <input className="w-full max-w-xl mx-auto border rounded-lg p-3" placeholder="輸入你的目標校系" onChange={e=>on_input(e.target.value)} />
            )}
            {current.id === 'q14' && (
              <input className="w-full max-w-xs mx-auto border rounded-lg p-3 text-center" type="number" placeholder="最近模考分數（選填）" onChange={e=>on_input(e.target.value)} />
            )}
            {current.id === 'q15' && current.choices && (
              <div className="mx-auto max-w-xl space-y-3">
                {current.choices.map((c, i) => (
                  <button key={i} onClick={()=>on_choice(i)} className="w-full py-4 rounded-full bg-accent/80 hover:bg-accent text-foreground font-medium shadow-sm">
                    {c}
                  </button>
                ))}
              </div>
            )}
            <div className="mt-8 flex justify-between max-w-xl mx-auto">
              <Button variant="outline" onClick={go_prev} disabled={idx===0}>返回</Button>
              {idx < question_bank.length-1 ? (
                <Button variant="outline" onClick={go_next}>下一題</Button>
              ) : (
                <Button onClick={finish}>完成</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ReadyScoreLite;
