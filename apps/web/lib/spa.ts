import { logEvent } from './events';

function trackPageView() {
  const page = location.hash ? location.hash.slice(1) || '/' : location.pathname || '/';
  logEvent('page_view', { page });
}

export function initializeSpaTracking() {
  // initial
  trackPageView();
  // hash router
  window.addEventListener('hashchange', trackPageView);
}

