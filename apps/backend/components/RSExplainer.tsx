import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/Dialog';
import { Button } from './ui/Button';
import useAuthStore from '../state/useAuthStore';
import useUiStore from '../state/useUiStore';

interface RSExplainerProps {
  isOpen: boolean;
  onClose: () => void;
}

const RSExplainer: React.FC<RSExplainerProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const isAuthed = useAuthStore(state => state.isAuthed);
    const { openAuthModal, closeRsExplainerModal } = useUiStore();

    const handleStartTest = () => {
        closeRsExplainerModal();
        if (isAuthed) {
            navigate('/ready-score-lite');
        } else {
            openAuthModal();
        }
    };

    const features = [
        { title: '差距指標 (%)', description: '顯示你與目標科系門檻的距離（例：目標 90%｜你 82% → 差距 −8%）' },
        { title: '僅在正式情境更新', description: '只在模考/指定平台後更新；日常練習不影響' },
        { title: '含應考心態與反應', description: '模擬時間壓力/臨場表現，反映專注力與應變，不只看正確率' },
        { title: '可視化追蹤', description: '每次模考更新差距曲線，你與家長都能清楚看到趨勢' }
    ];

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <DialogHeader>
                <DialogTitle>What is Ready Score?</DialogTitle>
                <DialogDescription>
                    一個專為學測英文設計的動態實力指標。
                </DialogDescription>
            </DialogHeader>
            <DialogContent>
                <ul className="space-y-4">
                    {features.map(feature => (
                        <li key={feature.title}>
                            <p className="font-semibold text-foreground">{feature.title}</p>
                            <p className="text-muted-foreground text-sm">{feature.description}</p>
                        </li>
                    ))}
                </ul>
            </DialogContent>
            <DialogFooter>
                <Button onClick={handleStartTest} className="w-full">Start 10-question Ready Score Lite</Button>
            </DialogFooter>
        </Dialog>
    );
};

export default RSExplainer;