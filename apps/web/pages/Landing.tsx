import React, { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { logEvent } from '../lib/events';
import useUiStore from '../state/useUiStore';
import { signIn } from '../lib/auth';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { openWaitlistModal, openRsExplainerModal } = useUiStore();

  const EXAM_DATE = (import.meta as any)?.env?.VITE_EXAM_DATE || (import.meta as any)?.env?.NEXT_PUBLIC_EXAM_DATE || '2026-01-20';
  const daysToExam = useMemo(() => {
    const target = new Date(EXAM_DATE + 'T00:00:00');
    const now = new Date();
    const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [EXAM_DATE]);
  useEffect(() => {
    logEvent('lp_view', { page: 'landing' });
  }, []);

  const startLite = useCallback(() => {
    logEvent('cta_click', { cta_id: 'start_rslite', page: 'landing' });
    // Primary CTA: Auth → RS Lite
    signIn('google').finally(() => navigate('/ready-score-lite'));
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
    <div className="container mx-auto px-4 py-12 space-y-16">
      {/* Hero */}
      <section className="text-center pt-6">
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
          最懂學測的台大團隊，為你量身打造最高效的衝刺計劃。
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-6">
          考前 {daysToExam} 天，不再無效努力（自動倒數到考試日）。
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={startLite}>Get my Ready Score</Button>
          <Button variant="outline" onClick={openExplainer}>What is Ready Score?</Button>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          👉 立即加入，即可免費獲得《Top 10 文法學霸筆記》 PDF 🎁
        </p>
      </section>

      {/* Problem (masonry-like simple grid) */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">為什麼需要 Ready Score？</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-lg border p-4 text-left">
            <h3 className="font-semibold mb-2">大學生科系滿意度</h3>
            <p className="text-sm text-muted-foreground">超過一半後悔科系（示意圖）</p>
            <div className="h-40 bg-muted rounded" />
          </div>
          <div className="rounded-lg border p-4 text-left">
            <h3 className="font-semibold mb-2">學生焦慮指數</h3>
            <p className="text-sm text-muted-foreground">近年持續上升（示意圖）</p>
            <div className="h-40 bg-muted rounded" />
          </div>
          <div className="rounded-lg border p-4 text-left">
            <h3 className="font-semibold mb-2">多題型錯誤率</h3>
            <p className="text-sm text-muted-foreground">高達七成（示意圖）</p>
            <div className="h-40 bg-muted rounded" />
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground">補習提供題目，我們用數據讓努力變有效。</p>
      </section>

      {/* Guide */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">學習怎麼更有效？</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { t: '依需求選課', s: '精準配對你的弱項' },
            { t: '學霸複習系統', s: '強調實戰與回顧' },
            { t: '每日重點練習', s: '系統推送關鍵題型' },
            { t: '心理學驅動學習', s: '正向回饋，降低焦慮' },
          ].map((c) => (
            <div key={c.t} className="rounded-lg border p-4 text-left hover:bg-muted/50 transition" title={c.s}>
              <h3 className="font-semibold mb-1">{c.t}</h3>
              <p className="text-sm text-muted-foreground">{c.s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Plan steps */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">這樣，你就能穩定進步。</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { t: '學前精準診斷', s: 'Ready Score Lite' },
            { t: '每日重點練習', s: '系統依診斷排程' },
            { t: '模考與差距追蹤', s: 'Ready Score % 與差距縮短' },
          ].map((c, i) => (
            <div key={c.t} className="rounded-lg border p-6 text-left">
              <div className="text-3xl font-bold mb-2">{i + 1}</div>
              <h3 className="font-semibold mb-1">{c.t}</h3>
              <p className="text-sm text-muted-foreground">{c.s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Parents */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">給家長</h2>
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground mb-3">差距曲線與月報示例一目了然，了解孩子的進步軌跡。</p>
          <Button variant="outline" onClick={() => { logEvent('howitworks_click', { from: 'parents_card' }); navigate('/parents'); }}>前往家長專區</Button>
        </div>
      </section>

      {/* FAQ (simple) */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">常見問題</h2>
        <div className="space-y-2 text-left">
          {[
            { id: 'how_rs', q: 'Ready Score 怎麼算？', a: '以正式情境與差距曲線為核心，提供百分比與建議。' },
            { id: 'practice_affect', q: '練習會不會影響？', a: '不會；僅模考會更新正式分數。' },
            { id: 'privacy', q: '資料是否安全？', a: '採用 Firebase Auth 與最小權限，僅用於學習分析。' },
          ].map((f) => (
            <details key={f.id} className="rounded-lg border p-4" onToggle={(e) => logEvent('faq_toggle', { faq_id: f.id, open: (e.target as HTMLDetailsElement).open })}>
              <summary className="font-medium cursor-pointer">{f.q}</summary>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
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
