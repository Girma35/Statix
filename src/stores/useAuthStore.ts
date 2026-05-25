import { create } from 'zustand';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  deleteUser,
  User,
} from 'firebase/auth';
import {
  doc, setDoc, getDoc, updateDoc, deleteDoc, collection, getDocs, writeBatch,
} from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { useHeadlistStore } from '@/stores/useHeadlistStore';
import { useDistillationStore } from '@/stores/useDistillationStore';
import type { UserProfile } from '@/types';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;

  initialize: () => () => void;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateStreak: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,
  error: null,

  initialize: () => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile = await fetchProfile(user.uid);
        set({ user, profile, loading: false, initialized: true });
      } else {
        set({ user: null, profile: null, loading: false, initialized: true });
      }
    });
    return unsub;
  },

  signUp: async (email, password, displayName) => {
    set({ loading: true, error: null });
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const profile: UserProfile = {
        uid: cred.user.uid,
        email,
        displayName,
        totalWordsLearned: 0,
        streak: 0,
        lastActiveDate: new Date().toISOString().split('T')[0],
        createdAt: Date.now(),
      };
      await setDoc(doc(db, 'users', cred.user.uid), profile);
      set({ user: cred.user, profile, loading: false });
    } catch (err: any) {
      set({ loading: false, error: err.message });
    }
  },

  logIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const profile = await fetchProfile(cred.user.uid);
      set({ user: cred.user, profile, loading: false });
    } catch (err: any) {
      set({ loading: false, error: err.message });
    }
  },

  logOut: async () => {
    set({ loading: true });
    await signOut(auth);
    // Reset all stores on logout
    useHeadlistStore.setState({ headlists: [], loading: false, error: null });
    useDistillationStore.setState({ session: null, loading: false, error: null });
    set({ user: null, profile: null, loading: false });
  },

  resetPassword: async (email) => {
    set({ error: null });
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  updateStreak: async () => {
    const { profile } = get();
    if (!profile) return;
    const today = new Date().toISOString().split('T')[0];
    if (profile.lastActiveDate === today) return; // already updated today

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const newStreak = profile.lastActiveDate === yesterday ? profile.streak + 1 : 1;

    const updated = { ...profile, streak: newStreak, lastActiveDate: today };
    await updateDoc(doc(db, 'users', profile.uid), { streak: newStreak, lastActiveDate: today });
    set({ profile: updated });
  },

  clearError: () => set({ error: null }),

  updateProfile: async (data) => {
    const { user } = get();
    if (!user) return;
    const updated = { ...get().profile!, ...data };
    await setDoc(doc(db, 'users', user.uid), updated, { merge: true });
    set({ profile: updated });
  },

  refreshProfile: async () => {
    const { user } = get();
    if (!user) return;
    const profile = await fetchProfile(user.uid);
    set({ profile });
  },

  deleteAccount: async () => {
    const { user } = get();
    if (!user) {
      set({ error: 'No user is currently logged in.' });
      return;
    }
    set({ loading: true, error: null });
    try {
      // Delete all headlists subcollection documents
      const headlistsSnap = await getDocs(collection(db, 'users', user.uid, 'headlists'));
      const batch = writeBatch(db);
      headlistsSnap.docs.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });
      await batch.commit();

      // Delete the user profile document from Firestore
      await deleteDoc(doc(db, 'users', user.uid));

      // Delete the Firebase Auth user account
      await deleteUser(user);

      // Reset all stores and sign out
      useHeadlistStore.setState({ headlists: [], loading: false, error: null });
      useDistillationStore.setState({ session: null, loading: false, error: null });
      set({ user: null, profile: null, loading: false });
    } catch (err: any) {
      if (err.code === 'auth/requires-recent-login') {
        set({
          loading: false,
          error: 'For security, please log out, log back in, and try deleting your account again.',
        });
      } else {
        set({ loading: false, error: err.message });
      }
    }
  },
}));

async function fetchProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}
