// ----- Word -----
export interface Word {
  id: string;
  word: string;
  translation: string;
  notes: string;
  cycle: number; // 0 = not yet distilled, 1 = D1, 2 = D2, etc.
  remembered: boolean;
  createdAt: number; // timestamp
}

// ----- Headlist -----
export interface Headlist {
  id: string;
  name: string;
  words: Word[];
  createdAt: number;
  distillationDate: number; // 14 days after creation, timestamp
  completed: boolean; // true when all words remembered
}

// ----- User profile -----
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  totalWordsLearned: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  createdAt: number;
}

// ----- Auth -----
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

// ----- Distillation -----
export interface DistillationSession {
  headlistId: string;
  headlistName: string;
  words: Word[];
  currentIndex: number;
  rememberedCount: number;
  forgotCount: number;
  cycle: number;
  completed: boolean;
}
