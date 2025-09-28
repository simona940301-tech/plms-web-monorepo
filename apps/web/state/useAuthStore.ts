
import { create } from 'zustand';
import { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  idToken: string | null;
  isAuthed: boolean;
  setAuth: (user: User, idToken: string) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  idToken: null,
  isAuthed: false,
  setAuth: (user, idToken) => set({ user, idToken, isAuthed: true }),
  clearAuth: () => set({ user: null, idToken: null, isAuthed: false }),
}));

export default useAuthStore;
