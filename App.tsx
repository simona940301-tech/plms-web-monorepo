
import React, { Suspense, lazy } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import WaitlistModal from './components/WaitlistModal';
import AuthModal from './components/AuthModal';
import RSExplainer from './components/RSExplainer';
import useUiStore from './state/useUiStore';
import FoundingSurveyModal from './components/FoundingSurveyModal';
import { Toaster } from './components/ui/Toast';

const Landing = lazy(() => import('./pages/Landing'));
const ReadyScoreLite = lazy(() => import('./pages/ReadyScoreLite'));
const Parents = lazy(() => import('./pages/Parents'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));

const App: React.FC = () => {
    const isWaitlistModalOpen = useUiStore(state => state.isWaitlistModalOpen);
    const isAuthModalOpen = useUiStore(state => state.isAuthModalOpen);
    const isRsExplainerModalOpen = useUiStore(state => state.isRsExplainerModalOpen);
    const isSurveyModalOpen = useUiStore(state => state.isSurveyModalOpen);
    const { closeWaitlistModal, closeAuthModal, closeRsExplainerModal, closeSurveyModal } = useUiStore();

    return (
        <HashRouter>
            <div className="flex flex-col min-h-screen bg-background text-foreground">
                <Header />
                <main className="flex-grow">
                    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
                        <Routes>
                            <Route path="/" element={<Landing />} />
                            <Route path="/ready-score-lite" element={<ReadyScoreLite />} />
                            <Route path="/parents" element={<Parents />} />
                            <Route path="/privacy" element={<Privacy />} />
                            <Route path="/terms" element={<Terms />} />
                        </Routes>
                    </Suspense>
                </main>

                {isWaitlistModalOpen && <WaitlistModal isOpen={isWaitlistModalOpen} onClose={closeWaitlistModal} />}
                {isAuthModalOpen && <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />}
                {isRsExplainerModalOpen && <RSExplainer isOpen={isRsExplainerModalOpen} onClose={closeRsExplainerModal} />}
                {isSurveyModalOpen && <FoundingSurveyModal isOpen={isSurveyModalOpen} onClose={closeSurveyModal} />}
                <Toaster />
            </div>
        </HashRouter>
    );
};

export default App;
