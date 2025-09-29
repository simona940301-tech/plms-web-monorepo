const CONSENT_KEY = 'plms_consent_marketing';

export function hasMarketingConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === 'granted';
  } catch {
    return false;
  }
}

export function setMarketingConsent(granted: boolean) {
  try {
    localStorage.setItem(CONSENT_KEY, granted ? 'granted' : 'denied');
  } catch {}
}

export function initializeGTM() {
  const gtmId = import.meta.env.VITE_GTM_ID as string | undefined;
  if (!gtmId) return; // GTM not configured
  if (!hasMarketingConsent()) return; // respect consent

  if ((window as any).dataLayer && (window as any).__gtmInjected) return;

  // bootstrap dataLayer
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({ event: 'plms_boot' });

  // Avoid duplicate injection
  if (document.getElementById('gtm-script')) return;

  // Use insertAdjacentHTML to avoid appendChild issues with special characters
  document.head.insertAdjacentHTML('beforeend', `
    <script id="gtm-script">
      (function(w,d,s,l,i){
        w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
        var f=d.getElementsByTagName(s)[0], j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
        j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl; f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');
    </script>
  `);

  document.body.insertAdjacentHTML('afterbegin', `
    <noscript id="gtm-noscript">
      <iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>
    </noscript>
  `);

  (window as any).__gtmInjected = true;
}

