import { create } from 'zustand';
import { doc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useHeadlistStore } from '@/stores/useHeadlistStore';
import { scheduleDistillationReminder } from '@/services/notifications';
import type { Word, Headlist, DistillationSession } from '@/types';

interface DistillationState {
  session: DistillationSession | null;
  loading: boolean;
  error: string | null;

  startSession: (headlist: Headlist) => void;
  nextWord: () => void;
  markRemembered: () => void;
  markForgot: () => void;
  completeSession: (userId: string) => Promise<{ remembered: Word[]; forgot: Word[] }>;
  resetSession: () => void;
}

export const useDistillationStore = create<DistillationState>((set, get) => ({
  session: null,
  loading: false,
  error: null,

  startSession: (headlist) => {
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
        cycle: wordsToReview[0]?.cycle ?? 0,
        completed: false,
      },
      error: null,
      loading: false,
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

  markRemembered: () => {
    const { session } = get();
    if (!session) return;
    const updatedWords = session.words.map((w, i) =>
      i === session.currentIndex ? { ...w, remembered: true, cycle: w.cycle + 1 } : w
    );
    set({
      session: {
        ...session,
        words: updatedWords,
        rememberedCount: session.rememberedCount + 1,
      },
    });
  },

  markForgot: () => {
    const { session } = get();
    if (!session) return;
    const updatedWords = session.words.map((w, i) =>
      i === session.currentIndex ? { ...w, remembered: false, cycle: w.cycle + 1 } : w
    );
    set({
      session: {
        ...session,
        words: updatedWords,
        forgotCount: session.forgotCount + 1,
      },
    });
  },

  completeSession: async (userId) => {
    const { session } = get();
    if (!session) return { remembered: [], forgot: [] };
    set({ loading: true });
    try {
      const remembered = session.words.filter((w) => w.remembered);
      const forgot = session.words.filter((w) => !w.remembered);

      // Update total words learned
      if (remembered.length > 0) {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, { totalWordsLearned: increment(remembered.length) });
      }

      // Update original headlist: keep only remembered words, remove forgotten ones
      const originalRef = doc(db, 'users', userId, 'headlists', session.headlistId);
      if (forgot.length === 0) {
        // All words remembered – mark headlist as completed
        await setDoc(originalRef, { words: remembered, completed: true }, { merge: true });
      } else {
        // Some words forgotten – keep only remembered in original
        await setDoc(originalRef, { words: remembered }, { merge: true });

        // Create new headlist for the next distillation cycle
        const now = Date.now();
        const newCycle = forgot[0].cycle;
        const newHeadlistId = `${session.headlistId}_d${newCycle}`;
        const newHeadlistRef = doc(db, 'users', userId, 'headlists', newHeadlistId);
        await setDoc(newHeadlistRef, {
          name: `${session.headlistName} (D${newCycle})`,
          words: forgot.map((w) => ({ ...w, remembered: false })),
          createdAt: now,
          distillationDate: now + 14 * 24 * 60 * 60 * 1000,
          completed: false,
        });

        // Schedule notification for the new cycle headlist
        scheduleDistillationReminder(
          newHeadlistId,
          `${session.headlistName} (D${newCycle})`,
          now + 14 * 24 * 60 * 60 * 1000,
        );
      }

      // Refresh headlist cache so the UI shows up-to-date data
      await useHeadlistStore.getState().fetchHeadlists(userId);

      // Keep the session but mark it as completed so the results screen can display
      set({ session: { ...session, completed: true }, loading: false });
      return { remembered, forgot };
    } catch (err: any) {
      set({ loading: false, error: err.message });
      return { remembered: [], forgot: [] };
    }
  },

  resetSession: () => set({ session: null, error: null }),
}));
