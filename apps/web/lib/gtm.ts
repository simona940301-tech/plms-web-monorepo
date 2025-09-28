export function initializeGTM() {
  const gtmId = import.meta.env.VITE_GTM_ID as string | undefined;
  if (!gtmId) {
    return; // GTM not configured
  }

  // Avoid duplicate injection
  if (document.getElementById('gtm-script')) return;

  // Insert GTM <script> in <head>
  const script = document.createElement('script');
  script.id = 'gtm-script';
  script.innerHTML = `(
    function(w,d,s,l,i){
      w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
      var f=d.getElementsByTagName(s)[0], j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
      j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl; f.parentNode!.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtmId}');`;
  document.head.appendChild(script);

  // Insert <noscript> right after <body> start
  const noscript = document.createElement('noscript');
  noscript.id = 'gtm-noscript';
  noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
  const body = document.body;
  body.insertBefore(noscript, body.firstChild);
}

