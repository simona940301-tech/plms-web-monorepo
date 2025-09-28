import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { logEvent } from '../lib/events';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    logEvent('lp_view', { page: 'landing' });
  }, []);

  const startLite = useCallback(() => {
    logEvent('cta_click', { cta_id: 'start_rslite', page: 'landing' });
    navigate('/ready-score-lite');
  }, [navigate]);

  return (
    <section className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">PLMS Ready Score</h1>
      <p className="text-muted-foreground mb-8">10 題快速測試，立刻看出你的強弱項。</p>
      <div className="flex items-center justify-center gap-3">
        <Button onClick={startLite}>開始 Ready Score Lite</Button>
      </div>
    </section>
  );
};

export default Landing;
