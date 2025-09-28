
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/Dialog';
import { Button } from './ui/Button';
import { signIn, AuthProviderType } from '../lib/auth';
import useAuthStore from '../state/useAuthStore';
import { track } from '../lib/track';
import { toast } from './ui/Toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState<AuthProviderType | null>(null);
    const setAuth = useAuthStore(state => state.setAuth);
    const navigate = useNavigate();

    const handleSignIn = async (provider: AuthProviderType) => {
        setLoading(provider);
        try {
            const result = await signIn(provider);
            if (result) {
                setAuth(result.user, result.idToken);
                track('auth_success', { provider });
                toast(`Welcome, ${result.user.displayName}!`, 'success');
                onClose();
                navigate('/ready-score-lite');
            } else {
                 toast('Authentication failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error(error);
            toast('An error occurred during sign-in.', 'error');
        } finally {
            setLoading(null);
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <DialogHeader>
                <DialogTitle>快速登入/註冊</DialogTitle>
                <DialogDescription>
                    加入 PLMS，開始你的高效學習之旅。
                </DialogDescription>
            </DialogHeader>
            <DialogContent>
                <div className="space-y-3">
                    <Button 
                        onClick={() => handleSignIn('google')} 
                        className="w-full" 
                        variant="outline"
                        disabled={loading !== null}
                    >
                        {loading === 'google' ? 'Signing in...' : 'Sign in with Google'}
                    </Button>
                    <Button 
                        onClick={() => handleSignIn('facebook')} 
                        className="w-full" 
                        variant="outline"
                        disabled={loading !== null}
                    >
                        {loading === 'facebook' ? 'Signing in...' : 'Sign in with Facebook'}
                    </Button>
                    <Button 
                        onClick={() => handleSignIn('apple')} 
                        className="w-full" 
                        variant="outline"
                        disabled={loading !== null}
                    >
                        {loading === 'apple' ? 'Signing in...' : 'Sign in with Apple'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AuthModal;
