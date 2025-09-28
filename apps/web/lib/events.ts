import { getUtm } from './utm';
import { getVariant } from './ab';

type Payload = Record<string, any> | undefined;

export function logEvent(name: string, payload?: Payload) {
  const utm = getUtm();
  const variant = getVariant('hero'); // default test key; pages can override
  const data = { event: name, utm, variant, ...payload };
  // push to dataLayer if available
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push(data);
  // dev console breadcrumb
  if (import.meta.env.DEV) {
    console.log('[event]', data);
  }
}

