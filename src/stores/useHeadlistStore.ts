import { create } from 'zustand';
import {
  collection,
  doc,
  addDoc,
  setDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { scheduleDistillationReminder, cancelDistillationReminder } from '@/services/notifications';
import type { Headlist, Word } from '@/types';

interface HeadlistState {
  headlists: Headlist[];
  loading: boolean;
  error: string | null;

  fetchHeadlists: (userId: string) => Promise<void>;
  createHeadlist: (userId: string, name: string) => Promise<string>;
  deleteHeadlist: (userId: string, headlistId: string) => Promise<void>;
  addWord: (userId: string, headlistId: string, word: Omit<Word, 'id' | 'cycle' | 'remembered' | 'createdAt'>) => Promise<void>;
  editWord: (userId: string, headlistId: string, wordId: string, updates: Partial<Pick<Word, 'word' | 'translation' | 'notes'>>) => Promise<void>;
  deleteWord: (userId: string, headlistId: string, wordId: string) => Promise<void>;
  getHeadlist: (headlistId: string) => Headlist | undefined;
  clearError: () => void;
}

export const useHeadlistStore = create<HeadlistState>((set, get) => ({
  headlists: [],
  loading: false,
  error: null,

  fetchHeadlists: async (userId) => {
    set({ loading: true, error: null });
    try {
      const q = query(
        collection(db, 'users', userId, 'headlists'),
        where('completed', '==', false)
      );
      const snap = await getDocs(q);
      const headlists = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Headlist));
      set({ headlists, loading: false });
    } catch (err: any) {
      set({ loading: false, error: err.message });
    }
  },

  createHeadlist: async (userId, name) => {
    set({ loading: true, error: null });
    try {
      const now = Date.now();
      const distillationDate = now + 14 * 24 * 60 * 60 * 1000; // 14 days
      const ref = await addDoc(collection(db, 'users', userId, 'headlists'), {
        name,
        words: [],
        createdAt: now,
        distillationDate,
        completed: false,
      });
      const newHeadlist: Headlist = {
        id: ref.id,
        name,
        words: [],
        createdAt: now,
        distillationDate,
        completed: false,
      };
      set({ headlists: [...get().headlists, newHeadlist], loading: false });
      // Schedule notification
      scheduleDistillationReminder(ref.id, name, distillationDate);
      return ref.id;
    } catch (err: any) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  deleteHeadlist: async (userId, headlistId) => {
    set({ error: null });
    try {
      await deleteDoc(doc(db, 'users', userId, 'headlists', headlistId));
      await cancelDistillationReminder(headlistId);
      set({ headlists: get().headlists.filter((h) => h.id !== headlistId) });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  addWord: async (userId, headlistId, wordData) => {
    set({ error: null });
    const headlist = get().headlists.find((h) => h.id === headlistId);
    if (!headlist) return;
    if (headlist.words.length >= 25) {
      set({ error: 'Headlist is full (25 words max)' });
      return;
    }
    try {
      const newWord: Word = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        ...wordData,
        cycle: 0,
        remembered: false,
        createdAt: Date.now(),
      };
      const updatedWords = [...headlist.words, newWord];
      await setDoc(doc(db, 'users', userId, 'headlists', headlistId), { words: updatedWords }, { merge: true });
      set({
        headlists: get().headlists.map((h) =>
          h.id === headlistId ? { ...h, words: updatedWords } : h
        ),
      });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  editWord: async (userId, headlistId, wordId, updates) => {
    set({ error: null });
    try {
      const headlist = get().headlists.find((h) => h.id === headlistId);
      if (!headlist) return;
      const updatedWords = headlist.words.map((w) =>
        w.id === wordId ? { ...w, ...updates } : w
      );
      await setDoc(doc(db, 'users', userId, 'headlists', headlistId), { words: updatedWords }, { merge: true });
      set({
        headlists: get().headlists.map((h) =>
          h.id === headlistId ? { ...h, words: updatedWords } : h
        ),
      });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  deleteWord: async (userId, headlistId, wordId) => {
    set({ error: null });
    try {
      const headlist = get().headlists.find((h) => h.id === headlistId);
      if (!headlist) return;
      const updatedWords = headlist.words.filter((w) => w.id !== wordId);
      await setDoc(doc(db, 'users', userId, 'headlists', headlistId), { words: updatedWords }, { merge: true });
      set({
        headlists: get().headlists.map((h) =>
          h.id === headlistId ? { ...h, words: updatedWords } : h
        ),
      });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  getHeadlist: (headlistId) => {
    return get().headlists.find((h) => h.id === headlistId);
  },

  clearError: () => set({ error: null }),
}));
