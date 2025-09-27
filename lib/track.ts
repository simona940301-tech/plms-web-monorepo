
export const track = (event: string, payload?: Record<string, any>) => {
  console.log('[TRACK]', event, payload || '');
  // In the future, this can be extended to send data to GA4, Pixel, etc.
};
