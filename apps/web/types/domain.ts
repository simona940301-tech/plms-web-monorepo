
export type WrongCause = 'careless' | 'vocab' | 'inference' | 'time';

export interface RSLiteAttemptInput {
  score: number;          // 0..10
  pct: number;            // 0..100
  durationSec: number;
  used_back: boolean;
  wrongCauses: WrongCause[];
  utm?: Record<string,string>;
}

export interface WaitlistInput {
  email: string;
  name: string;
  grade: '高一' | '高二' | '高三' | '重考班' | '其他';
  examYear: '2026' | '2027' | '其他';
  targetMajor: string;
  targetScoreLevel: number;
  mockScoreLevel?: number;
  agree: true;
  utm?: Record<string, string>;
}

export interface SurveyInput {
  answers: Array<{q:string; a:string}>;
  utm?: Record<string,string>;
}
