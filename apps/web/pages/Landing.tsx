import React, { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { logEvent } from '../lib/events';
import useUiStore from '../state/useUiStore';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

const satisfactionData = [
  { name: '後悔', value: 55, color: '#f43f5e' },
  { name: '還可以', value: 32, color: '#f59e0b' },
  { name: '滿意', value: 13, color: '#10b981' },
];

const anxietyTrend = [
  { year: '2020', value: 68 },
  { year: '2021', value: 72 },
  { year: '2022', value: 76 },
  { year: '2023', value: 79 },
  { year: '2024', value: 82 },
];

const radarData = [
  { subject: '綜合測驗', v: 73 },
  { subject: '單字', v: 58 },
  { subject: '文意選填', v: 61 },
  { subject: '閱讀測驗', v: 52 },
  { subject: '翻譯', v: 56 },
];

const statsCards = [
  { label: 'Seed RS 診斷完成率', value: '92%' },
  { label: '平均 Seed RS 提升', value: '+8.7 pts' },
  { label: '家長推薦', value: '98%' },
];

const dailyLoopHighlights = [
  'Seed RS 與信心區間：看見自己真正的強弱點。',
  '每日微任務：3 題文法 + 1 題翻譯 + 1 張錯題，10 分鐘完成。',
  '隔天上午 10 點寄送完整診斷報告。',
  '家長摘要版：差距曲線、里程碑、學長姐評語一次整理。',
];

const testimonials = [
  '「Seed RS 讓我知道應該先攻字彙，兩週後文法也開始進步。」 — 高三生 Amber',
  '「Ready Score 的小任務讓孩子每天主動學 15 分鐘，壓力小很多。」 — 家長 Kelly',
  '「模考對應 Ready Score 差距曲線，確認自己真的在縮短弱點。」 — 重考生 Jason',
];

const faqItems = [
  { id: 'how_rs', q: 'Ready Score 怎麼算？', a: 'Seed RS 結合字彙、文法、翻譯三象限答題率與權重，搭配信心區間呈現出現在實力。' },
  { id: 'practice_affect', q: '練習會不會影響正式 Ready Score？', a: 'Ready Score Lite 與每日任務僅更新 Seed RS，不會覆蓋官方模考或正式成績。' },
  { id: 'privacy', q: '資料是否安全？', a: '採用 Firebase Auth 與最小權限存取，資料僅用於學習成效分析，絕不外洩。' },
  { id: 'line', q: '加入 LINE 之後會收到什麼？', a: '隔天上午 10 點收到完整診斷 PDF，之後每日提醒 10 分鐘任務與 Ready Score 更新。' },
];

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { openWaitlistModal, openRsExplainerModal } = useUiStore();

  const examDate = (import.meta as any)?.env?.VITE_EXAM_DATE || (import.meta as any)?.env?.NEXT_PUBLIC_EXAM_DATE || '2026-01-20';
  const daysToExam = useMemo(() => {
    const target = new Date(examDate + 'T00:00:00');
    const now = new Date();
    const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [examDate]);

  useEffect(() => {
    logEvent('lp_view', { page: 'landing' });
  }, []);

  const startLite = useCallback(() => {
    logEvent('cta_click', { cta_id: 'start_rslite', page: 'landing' });
    navigate('/onboarding');
  }, [navigate]);

  const openExplainer = useCallback(() => {
    logEvent('cta_click', { cta_id: 'open_rs_explainer', page: 'landing' });
    openRsExplainerModal();
  }, [openRsExplainerModal]);

  const openWaitlist = useCallback(() => {
    logEvent('waitlist_open', { page: 'landing' });
    openWaitlistModal();
  }, [openWaitlistModal]);

  return (
    <div className="container mx-auto px-4 py-16 space-y-24">
      {/* Hero */}
      <section className="grid gap-12 md:grid-cols-[1.1fr_0.9fr] items-center">
        <div className="text-center md:text-left space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            學人經 XueRenJing · Ready Score Lite
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
            最懂學測的台大團隊，為你量身打造最高效的衝刺計劃。
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            距離考試還有 {daysToExam} 天，別再盲目刷題。我們用數據告訴你下一步該攻哪裡。
          </p>
          <ul className="text-sm md:text-base text-muted-foreground grid gap-2 md:gap-3 md:max-w-xl mx-auto md:mx-0">
            <li>✓ 7 分鐘診斷字彙、文法、翻譯三象限強弱</li>
            <li>✓ 當天送出 10 分鐘微任務，隔天收到完整診斷報告</li>
            <li>✓ 與台大團隊共用同一套 Ready Score 系統</li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Button size="lg" onClick={startLite}>開始 Ready Score Lite 測驗</Button>
            <Button size="lg" variant="outline" onClick={openExplainer}>加入 Waiting List（解鎖完整讀書計劃）</Button>
          </div>
          <p className="text-sm text-muted-foreground">
            👉 立即加入，即可免費獲得《Top 10 文法學霸筆記》 PDF 🎁
          </p>
        </div>
        <div className="relative flex justify-center">
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-[2.5rem] bg-gradient-to-tr from-primary/10 via-primary/5 to-transparent border border-primary/20 shadow-[0_30px_70px_rgba(55,118,161,0.25)]">
            <img src="/logo.png" alt="學人經品牌 logo" className="absolute inset-8 md:inset-10 object-contain drop-shadow-xl" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 md:grid-cols-3">
        {statsCards.map((card) => (
          <div key={card.label} className="rounded-2xl bg-secondary/40 border border-primary/10 p-6 text-center">
            <p className="text-3xl md:text-4xl font-extrabold text-primary">{card.value}</p>
            <p className="text-sm md:text-base text-muted-foreground mt-2">{card.label}</p>
          </div>
        ))}
      </section>

      {/* Why Ready Score */}
      <section className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center md:text-left">為什麼需要 Ready Score？</h2>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-primary/20 bg-background p-5 shadow-sm">
              <h3 className="font-semibold mb-2">大學生科系滿意度</h3>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width={120} height={120}>
                  <PieChart>
                    <Pie dataKey="value" data={satisfactionData} innerRadius={26} outerRadius={54} paddingAngle={2}>
                      {satisfactionData.map((item) => (
                        <Cell key={item.name} fill={item.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full bg-rose-500" /> 後悔 55%</li>
                  <li className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full bg-amber-500" /> 還可以 32%</li>
                  <li className="flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-full bg-emerald-500" /> 滿意 13%</li>
                </ul>
              </div>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-background p-5 shadow-sm">
              <h3 className="font-semibold mb-2">學生焦慮指數（逐年）</h3>
              <ResponsiveContainer width="100%" height={170}>
                <LineChart data={anxietyTrend} margin={{ left: 8, right: 8, top: 10, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="year" stroke="#6b7280" />
                  <YAxis domain={[65, 85]} tick={{ fill: '#6b7280' }} stroke="#6b7280" />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#3776A1" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-background p-5 shadow-sm md:col-span-2">
              <h3 className="font-semibold mb-2">多題型錯誤率（%）</h3>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData} outerRadius={80}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                  <Radar dataKey="v" stroke="#3776A1" fill="#89CFF1" fillOpacity={0.35} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-background to-background border border-primary/10 p-6 space-y-4">
            <h3 className="text-xl font-semibold">Ready Score Lite 做到的三件事</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>・Seed RS 與信心區間：看出現在實力與上下限。</li>
              <li>・雷達圖解析三象限，快速鎖定補強題型。</li>
              <li>・隔天收到完整診斷與 7 日任務排程。</li>
            </ul>
            <div className="space-y-3">
              <Button className="w-full" onClick={startLite}>立即做 7 分鐘診斷</Button>
              <Button variant="outline" className="w-full" onClick={openExplainer}>Ready Score 完整方案介紹</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Daily loop & steps */}
      <section className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">Ready Score 的三步策略</h2>
            <p className="text-muted-foreground">從 Seed RS 診斷、每日任務到模考追蹤，Ready Score 幫你把「努力」變成看得見的進步曲線。</p>
            <div className="space-y-4">
              {[
                { title: 'Step 1 · Seed RS', desc: 'Lite 測驗在 7 分鐘內算出 Seed RS 與信心區間。' },
                { title: 'Step 2 · Daily Loop', desc: '每天 10 分鐘微任務，縮小 Seed RS 與目標差距。' },
                { title: 'Step 3 · Mastery Review', desc: '模考 x Ready Score 差距曲線，確認是否穩定成長。' },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-primary/15 p-4 bg-background shadow-sm">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-primary/15 bg-secondary/40 p-6 space-y-4">
            <h3 className="text-xl font-semibold">每日 Ready Score Loop</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {dailyLoopHighlights.map((text) => (
                <li key={text}>・{text}</li>
              ))}
            </ul>
            <Button className="w-full" onClick={openWaitlist}>搶先加入 Waiting List</Button>
          </div>
        </div>
      </section>

      {/* Parents & testimonials */}
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] items-center">
        <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-6 space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">給家長的安心報告</h2>
          <p className="text-muted-foreground">Ready Score 會把孩子的 Seed RS 與差距曲線整理成一份「家長摘要」，讓你看得懂，也知道下一步要怎麼陪伴。</p>
          <Button variant="outline" onClick={() => { logEvent('howitworks_click', { from: 'parents_card' }); navigate('/parents'); }}>了解家長版方案</Button>
        </div>
        <div className="grid gap-4">
          {testimonials.map((quote, index) => (
            <div key={index} className="rounded-2xl border border-primary/10 bg-background p-5 text-sm text-muted-foreground shadow-sm">
              {quote}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center md:text-left">常見問題</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {faqItems.map((item) => (
            <details
              key={item.id}
              className="rounded-2xl border border-primary/15 bg-background p-5"
              onToggle={(e) => logEvent('faq_toggle', { faq_id: item.id, open: (e.target as HTMLDetailsElement).open })}
            >
              <summary className="font-semibold cursor-pointer text-primary">{item.q}</summary>
              <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="rounded-3xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-8 md:p-12 text-center space-y-6">
        <h2 className="text-2xl md:text-3xl font-semibold">準備好進化你的 Ready Score 了嗎？</h2>
        <p className="text-sm md:text-base opacity-80">加入 LINE 解鎖完整診斷，或加入 Waiting List 率先體驗會員完整讀書計劃。</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" variant="secondary" className="text-primary" onClick={() => logEvent('line_join_click', { from: 'footer_cta' })}>加入 LINE 解鎖完整診斷</Button>
          <Button size="lg" variant="outline" className="border-white/60 text-primary-foreground" onClick={openWaitlist}>加入 Waiting List</Button>
        </div>
      </section>

      {/* Floating CTA */}
      <button onClick={openWaitlist} className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-40 px-4 py-3 rounded-full bg-primary text-primary-foreground shadow-lg">
        Join the Waiting List
      </button>
    </div>
  );
};

export default Landing;
