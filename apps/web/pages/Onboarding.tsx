import React, { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import useAuthStore from '../state/useAuthStore';
import { signIn } from '../lib/auth';
import { logEvent } from '../lib/events';
import { set_onboarding, upsert_user } from '../lib/db';
import { useNavigate } from 'react-router-dom';

const grades = ['高一','高二','高三','其他'];
const level_options = ['頂標','前標','均標','後標','底標'];

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const setAuth = useAuthStore(state => state.setAuth);
  const [step, set_step] = useState(0); // 0 login, 1 warm, 2 goals
  const [grade, set_grade] = useState('');
  const [target_major, set_target_major] = useState('');
  const [target_band, set_target_band] = useState('');
  const [self_level, set_self_level] = useState('');

  useEffect(() => {
    if (user && step === 0) {
      set_step(1);
    }
  }, [user, step]);

  useEffect(() => { logEvent('onboarding_view', { step }); }, [step]);

  const do_login = async (provider: 'google'|'facebook'|'apple') => {
    try {
      const res = await signIn(provider);
      if (res) {
        setAuth(res.user, res.idToken);
        await upsert_user(res.user.uid, { source: 'onboarding' });
        await set_onboarding(res.user.uid, 0, { completed: false });
        set_step(1);
      }
    } catch {}
  };

  const submit_step1 = async () => {
    if (!user) return; 
    await set_onboarding(user.uid, 1, { grade });
    set_step(2);
  };

  const submit_step2 = async () => {
    if (!user) return;
    await set_onboarding(user.uid, 2, { target_major, target_band, self_level });
    navigate('/ready-score-lite');
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      {step === 0 && (
        <div className="bg-white dark:bg-background rounded-2xl shadow p-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">使用你的帳號登入</h2>
          <p className="text-muted-foreground mb-6">才能為你建立專屬的學習曲線 🙂</p>
          <div className="flex flex-col gap-3 max-w-sm mx-auto">
            <Button onClick={()=>do_login('google')}>以 Google 登入</Button>
            <Button variant="outline" onClick={()=>do_login('facebook')}>以 Facebook 登入</Button>
            <Button variant="outline" onClick={()=>do_login('apple')}>以 Apple 登入</Button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="bg-white dark:bg-background rounded-2xl shadow p-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">先認識你一點點</h2>
          <p className="text-muted-foreground mb-6">問題很簡單，不涉及隱私</p>
          <div className="max-w-sm mx-auto text-left">
            <label className="block text-sm mb-2">你的年級？</label>
            <select value={grade} onChange={e=>set_grade(e.target.value)} className="w-full border rounded-lg p-3">
              <option value="">請選擇</option>
              {grades.map(g=> <option key={g} value={g}>{g}</option>)}
            </select>
            <Button className="mt-6 w-full" onClick={submit_step1} disabled={!grade}>下一步</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white dark:bg-background rounded-2xl shadow p-8 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">你的目標與自評</h2>
          <div className="max-w-md mx-auto text-left space-y-5">
            <div>
              <label className="block text-sm mb-2">目標校系</label>
              <input className="w-full border rounded-lg p-3" value={target_major} onChange={e=>set_target_major(e.target.value)} placeholder="例如：台大 資管" />
            </div>
            <div>
              <label className="block text-sm mb-2">理想級分</label>
              <select value={target_band} onChange={e=>set_target_band(e.target.value)} className="w-full border rounded-lg p-3">
                <option value="">請選擇</option>
                {level_options.map(x=> <option key={x} value={x}>{x}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-2">目前英文程度自評</label>
              <select value={self_level} onChange={e=>set_self_level(e.target.value)} className="w-full border rounded-lg p-3">
                <option value="">請選擇</option>
                {level_options.map(x=> <option key={x} value={x}>{x}</option>)}
              </select>
            </div>
            <Button className="w-full" onClick={submit_step2} disabled={!target_major || !target_band || !self_level}>開始 Ready Score Lite 測驗</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
