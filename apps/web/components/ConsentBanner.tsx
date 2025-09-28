import React, { useEffect, useState } from 'react';
import { initializeGTM, hasMarketingConsent, setMarketingConsent } from '../lib/gtm';

const bannerStyle = 'fixed bottom-0 left-0 right-0 z-50 bg-black/80 text-white p-4 backdrop-blur';
const btn = 'px-3 py-2 rounded text-sm font-medium';

const ConsentBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!hasMarketingConsent());
  }, []);

  const accept = () => {
    setMarketingConsent(true);
    setVisible(false);
    initializeGTM();
  };

  const decline = () => {
    setMarketingConsent(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={bannerStyle} role="dialog" aria-live="polite">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        <p className="text-sm opacity-90">
          我們使用 Cookie 與第三方像素（GA4/Meta/TikTok）來改善體驗與評估成效。你可以同意或拒絕行銷 Cookie。
        </p>
        <div className="flex gap-2">
          <button className={`${btn} bg-white text-black`} onClick={accept}>同意</button>
          <button className={`${btn} border border-white/30`} onClick={decline}>拒絕</button>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner;

