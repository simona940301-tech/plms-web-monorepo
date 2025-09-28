import { logEvent } from './events';

export const track = (event: string, payload?: Record<string, any>) => {
  logEvent(event, payload);
};
