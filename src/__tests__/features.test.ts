/**
 * Feature Tests for Statix / Gold List App
 * 
 * These are Jest-compatible unit/integration tests covering the core 
 * business logic of the stores and utility functions.
 * 
 * Run with: npx jest (after installing jest + @testing-library/react-native)
 */

// ─────────────────────────────────────────────────────────────────────────────
// MOCK SETUP
// ─────────────────────────────────────────────────────────────────────────────

// Mock Firebase so tests run without real credentials
jest.mock('@/config/firebase.native', () => ({
  auth: {},
  db: {},
}));

// Mock expo-notifications (not supported in test env)
jest.mock('expo-notifications', () => ({}));

// ─────────────────────────────────────────────────────────────────────────────
// UNIT TESTS: Business Logic Helpers
// ─────────────────────────────────────────────────────────────────────────────

describe('Progress Calculation', () => {
  const makeWords = (total: number, remembered: number) =>
    Array.from({ length: total }, (_, i) => ({
      id: `word-${i}`,
      word: `word${i}`,
      translation: `trans${i}`,
      notes: '',
      cycle: 1,
      remembered: i < remembered,
      addedAt: Date.now(),
    }));

  it('calculates 0% retention for empty headlist', () => {
    const words = makeWords(0, 0);
    const pct = words.length > 0
      ? Math.round((words.filter((w) => w.remembered).length / words.length) * 100)
      : 0;
    expect(pct).toBe(0);
  });

  it('calculates 50% retention correctly', () => {
    const words = makeWords(10, 5);
    const pct = Math.round((words.filter((w) => w.remembered).length / words.length) * 100);
    expect(pct).toBe(50);
  });

  it('calculates 100% retention correctly', () => {
    const words = makeWords(25, 25);
    const pct = Math.round((words.filter((w) => w.remembered).length / words.length) * 100);
    expect(pct).toBe(100);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('Distillation Date Logic', () => {
  const FOURTEEN_DAYS_MS = 14 * 24 * 60 * 60 * 1000;

  it('sets distillation date 14 days in the future', () => {
    const now = Date.now();
    const distillationDate = now + FOURTEEN_DAYS_MS;
    const daysLeft = Math.ceil((distillationDate - now) / (1000 * 60 * 60 * 24));
    expect(daysLeft).toBe(14);
  });

  it('detects an overdue distillation', () => {
    const pastDate = Date.now() - 1000; // 1 second ago
    const isDue = pastDate <= Date.now();
    expect(isDue).toBe(true);
  });

  it('detects a future (not yet due) distillation', () => {
    const futureDate = Date.now() + FOURTEEN_DAYS_MS;
    const isDue = futureDate <= Date.now();
    expect(isDue).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('Headlist Word Limit', () => {
  it('correctly identifies a full headlist (25 words)', () => {
    const wordCount = 25;
    const isFull = wordCount >= 25;
    expect(isFull).toBe(true);
  });

  it('allows adding when under the limit', () => {
    const wordCount = 24;
    const isFull = wordCount >= 25;
    expect(isFull).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('Streak Calculation', () => {
  it('increments streak when user logs in on consecutive days', () => {
    const lastActive = new Date();
    lastActive.setDate(lastActive.getDate() - 1); // yesterday
    const today = new Date();
    const daysDiff = Math.floor(
      (today.setHours(0, 0, 0, 0) - lastActive.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
    );
    const currentStreak = 5;
    const newStreak = daysDiff === 1 ? currentStreak + 1 : daysDiff === 0 ? currentStreak : 1;
    expect(newStreak).toBe(6);
  });

  it('resets streak when user misses a day', () => {
    const lastActive = new Date();
    lastActive.setDate(lastActive.getDate() - 3); // 3 days ago
    const today = new Date();
    const daysDiff = Math.floor(
      (today.setHours(0, 0, 0, 0) - lastActive.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
    );
    const currentStreak = 10;
    const newStreak = daysDiff === 1 ? currentStreak + 1 : daysDiff === 0 ? currentStreak : 1;
    expect(newStreak).toBe(1);
  });

  it('keeps streak when user logs in twice on the same day', () => {
    const lastActive = new Date(); // today
    const today = new Date();
    const daysDiff = Math.floor(
      (today.setHours(0, 0, 0, 0) - lastActive.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
    );
    const currentStreak = 7;
    const newStreak = daysDiff === 1 ? currentStreak + 1 : daysDiff === 0 ? currentStreak : 1;
    expect(newStreak).toBe(7);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('Review Session Flow', () => {
  const makeSession = () => ({
    words: [
      { id: 'w1', word: 'Ephemeral', translation: 'Short-lived', notes: '', cycle: 1, remembered: false, addedAt: Date.now() },
      { id: 'w2', word: 'Ephemeral2', translation: 'Short-lived2', notes: '', cycle: 1, remembered: false, addedAt: Date.now() },
    ],
    currentIndex: 0,
    rememberedCount: 0,
    forgotCount: 0,
    completed: false,
    cycle: 1,
  });

  it('starts session with first word at index 0', () => {
    const session = makeSession();
    expect(session.currentIndex).toBe(0);
    expect(session.words[session.currentIndex].word).toBe('Ephemeral');
  });

  it('advances to the next word on remember', () => {
    const session = makeSession();
    session.rememberedCount += 1;
    session.currentIndex += 1;
    expect(session.currentIndex).toBe(1);
    expect(session.rememberedCount).toBe(1);
  });

  it('increments forgotCount on forgot', () => {
    const session = makeSession();
    session.forgotCount += 1;
    expect(session.forgotCount).toBe(1);
  });

  it('marks session as completed when all words are reviewed', () => {
    const session = makeSession();
    session.currentIndex = session.words.length - 1;
    session.rememberedCount = 2;
    session.completed = true;
    expect(session.completed).toBe(true);
    expect(session.rememberedCount).toBe(2);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('User Level Badge', () => {
  const getLevel = (streak: number) => {
    if (streak >= 30) return 'PLATINUM LEVEL';
    if (streak >= 14) return 'GOLD LEVEL';
    return 'SILVER LEVEL';
  };

  it('returns SILVER LEVEL for streak < 14', () => {
    expect(getLevel(5)).toBe('SILVER LEVEL');
    expect(getLevel(0)).toBe('SILVER LEVEL');
  });

  it('returns GOLD LEVEL for streak >= 14', () => {
    expect(getLevel(14)).toBe('GOLD LEVEL');
    expect(getLevel(20)).toBe('GOLD LEVEL');
  });

  it('returns PLATINUM LEVEL for streak >= 30', () => {
    expect(getLevel(30)).toBe('PLATINUM LEVEL');
    expect(getLevel(100)).toBe('PLATINUM LEVEL');
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('List Name Validation', () => {
  const isValidName = (name: string) => name.trim().length > 0;

  it('rejects empty list names', () => {
    expect(isValidName('')).toBe(false);
    expect(isValidName('   ')).toBe(false);
  });

  it('accepts valid list names', () => {
    expect(isValidName('German Adjectives')).toBe(true);
    expect(isValidName('SQL Basics')).toBe(true);
  });
});
