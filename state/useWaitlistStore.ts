
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WaitlistState {
  hasJoined: boolean;
  setHasJoined: (status: boolean) => void;
}

const useWaitlistStore = create<WaitlistState>()(
  persist(
    (set) => ({
      hasJoined: false,
      setHasJoined: (status) => set({ hasJoined: status }),
    }),
    {
      name: 'plms-waitlist-status',
    }
  )
);

export default useWaitlistStore;
