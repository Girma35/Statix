import { create } from 'zustand';
import { doc, setDoc, getDoc, updateDoc, increment, writeBatch } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Word, Headlist, DistillationSession } from '@/types';

interface DistillationState {
  session: DistillationSession | null;
  loading: boolean;
  error: string | null;

  startSession: (headlist: Headlist) => void;
  nextWord: () => void;
  markRemembered: (userId: string) => Promise<void>;
  markForgot: (userId: string) => Promise<void>;
  completeSession: (userId: string) => Promise<{ remembered: Word[]; forgot: Word[] }>;
  resetSession: () => void;
}

export const useDistillationStore = create<DistillationState>((set, get) => ({
  session: null,
  loading: false,
  error: null,

  startSession: (headlist) => {
    // Words that haven't been remembered yet
    const wordsToReview = headlist.words.filter((w) => !w.remembered);
    if (wordsToReview.length === 0) {
      set({ error: 'All words in this headlist have been remembered!' });
      return;
    }
    set({
      session: {
        headlistId: headlist.id,
        headlistName: headlist.name,
        words: wordsToReview,
        currentIndex: 0,
        rememberedCount: 0,
        forgotCount: 0,
        cycle: headlist.words[0]?.cycle ?? 0,
        completed: false,
      },
      error: null,
    });
  },

  nextWord: () => {
    const { session } = get();
    if (!session) return;
    const nextIndex = session.currentIndex + 1;
    if (nextIndex >= session.words.length) {
      set({ session: { ...session, completed: true } });
    } else {
      set({ session: { ...session, currentIndex: nextIndex } });
    }
  },

  markRemembered: async (userId) => {
    const { session } = get();
    if (!session) return;
    set({ loading: true });
    try {
      const word = session.words[session.currentIndex];
      const updatedWords = session.words.map((w, i) =>
        i === session.currentIndex ? { ...w, remembered: true, cycle: w.cycle + 1 } : w
      );
      // Update Firestore
      const ref = doc(db, 'users', userId, 'headlists', session.headlistId);
      setDoc(ref, { words: updatedWords }, { merge: true });
      set({
        session: {
          ...session,
          words: updatedWords,
          rememberedCount: session.rememberedCount + 1,
        },
        loading: false,
      });
    } catch (err: any) {
      set({ loading: false, error: err.message });
    }
  },

  markForgot: async (userId) => {
    const { session } = get();
    if (!session) return;
    set({ loading: true });
    try {
      const updatedWords = session.words.map((w, i) =>
        i === session.currentIndex ? { ...w, remembered: false, cycle: w.cycle + 1 } : w
      );
      const ref = doc(db, 'users', userId, 'headlists', session.headlistId);
      setDoc(ref, { words: updatedWords }, { merge: true });
      set({
        session: {
          ...session,
          words: updatedWords,
          forgotCount: session.forgotCount + 1,
        },
        loading: false,
      });
    } catch (err: any) {
      set({ loading: false, error: err.message });
    }
  },

  completeSession: async (userId) => {
    const { session } = get();
    if (!session) return { remembered: [], forgot: [] };
    set({ loading: true });
    try {
      const remembered = session.words.filter((w) => w.remembered);
      const forgot = session.words.filter((w) => !w.remembered);
      // Update total words learned
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { totalWordsLearned: increment(remembered.length) });

      // If there are forgotten words, create a new headlist for the next cycle
      if (forgot.length > 0) {
        const now = Date.now();
        const newCycle = forgot[0].cycle;
        const newHeadlistRef = doc(db, 'users', userId, 'headlists', `${session.headlistId}_d${newCycle}`);
        await setDoc(newHeadlistRef, {
          name: `${session.headlistName} (D${newCycle})`,
          words: forgot.map((w) => ({ ...w, remembered: false })),
          createdAt: now,
          distillationDate: now + 14 * 24 * 60 * 60 * 1000,
          completed: false,
        });
      }

      // Mark current headlist as completed if all words remembered
      if (forgot.length === 0) {
        const ref = doc(db, 'users', userId, 'headlists', session.headlistId);
        await setDoc(ref, { completed: true }, { merge: true });
      }

      set({ session: null, loading: false });
      return { remembered, forgot };
    } catch (err: any) {
      set({ loading: false, error: err.message });
      return { remembered: [], forgot: [] };
    }
  },

  resetSession: () => set({ session: null, error: null }),
}));
