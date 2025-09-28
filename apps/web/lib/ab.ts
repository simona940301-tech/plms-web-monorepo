const KEY_PREFIX = 'ab:';

export function getVariant(testKey: string, variants: string[] = ['A', 'B']): string {
  const url = new URL(window.location.href);
  const qp = url.searchParams.get('variant'); // e.g., hero:B
  if (qp) {
    const [key, val] = qp.split(':');
    if (key === testKey && variants.includes(val)) {
      localStorage.setItem(KEY_PREFIX + testKey, val);
      return val;
    }
  }
  const stored = localStorage.getItem(KEY_PREFIX + testKey);
  if (stored && variants.includes(stored)) return stored;
  const pick = variants[Math.floor(Math.random() * variants.length)];
  localStorage.setItem(KEY_PREFIX + testKey, pick);
  return pick;
}

