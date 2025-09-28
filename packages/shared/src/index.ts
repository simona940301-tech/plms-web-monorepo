import { z } from 'zod';

export const WaitlistInputSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  grade: z.string().min(1),
  target_major: z.string().optional().nullable(),
  utm: z.record(z.string()).optional(),
});
export type WaitlistInput = z.infer<typeof WaitlistInputSchema>;

export const RSLiteAttemptInputSchema = z.object({
  user_id: z.string().optional(),
  quiz_id: z.string().default('lite_web'),
  score: z.number().min(0).max(100),
  correct_count: z.number().min(0),
  source: z.literal('lite_web').default('lite_web'),
});
export type RSLiteAttemptInput = z.infer<typeof RSLiteAttemptInputSchema>;

