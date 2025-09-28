
import { create } from 'zustand';

interface UiState {
  isWaitlistModalOpen: boolean;
  isAuthModalOpen: boolean;
  isRsExplainerModalOpen: boolean;
  isSurveyModalOpen: boolean;
  openWaitlistModal: () => void;
  closeWaitlistModal: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openRsExplainerModal: () => void;
  closeRsExplainerModal: () => void;
  openSurveyModal: () => void;
  closeSurveyModal: () => void;
}

const useUiStore = create<UiState>((set) => ({
  isWaitlistModalOpen: false,
  isAuthModalOpen: false,
  isRsExplainerModalOpen: false,
  isSurveyModalOpen: false,
  openWaitlistModal: () => set({ isWaitlistModalOpen: true }),
  closeWaitlistModal: () => set({ isWaitlistModalOpen: false }),
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  openRsExplainerModal: () => set({ isRsExplainerModalOpen: true }),
  closeRsExplainerModal: () => set({ isRsExplainerModalOpen: false }),
  openSurveyModal: () => set({ isSurveyModalOpen: true }),
  closeSurveyModal: () => set({ isSurveyModalOpen: false }),
}));

export default useUiStore;
