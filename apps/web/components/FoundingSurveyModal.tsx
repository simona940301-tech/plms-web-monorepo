
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/Dialog';
import { Button } from './ui/Button';
import { SurveyInput } from '../types/domain';
import { submitFoundingSurvey } from '../lib/api';
import { track } from '../lib/track';
import { getUtm } from '../lib/utm';
import { toast } from './ui/Toast';

interface FoundingSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const surveyQuestions = [
    { q: "目前準備學測英文最大的挑戰是什麼？", options: ["單字背不起來", "文法搞不懂", "閱讀速度太慢", "作文沒靈感"] },
    { q: "你最希望這個系統在哪方面幫助你？", options: ["個人化進度追蹤", "弱點分析與加強", "作文批改", "模考演練"] },
    { q: "你的學習風格偏向？", options: ["視覺型 (圖表、影片)", "聽覺型 (講解)", "動手做 (大量練習)"] },
    { q: "考前一週，你覺得最需要的是？", options: ["高頻單字總複習", "錯題重練", "穩定軍心的鼓勵", "模擬考題"] },
    { q: "你是否願意參與我們的早期功能測試，並提供回饋？", options: ["非常願意", "考慮看看", "暫時不要"] }
];

const FoundingSurveyModal: React.FC<FoundingSurveyModalProps> = ({ isOpen, onClose }) => {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleSelect = (option: string) => {
        setAnswers(prev => ({ ...prev, [currentStep]: option }));
        if (currentStep < surveyQuestions.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };
    
    const handleSubmit = async () => {
        setLoading(true);
        const submissionData: SurveyInput = {
            answers: Object.entries(answers).map(([qIndex, a]) => ({ q: surveyQuestions[parseInt(qIndex)].q, a })),
            utm: getUtm() || undefined
        };
        try {
            await submitFoundingSurvey(submissionData);
            track('survey_submit', submissionData);
            toast('感謝您的寶貴意見！', 'success');
            onClose();
        } catch (error) {
            console.error('Survey submission failed', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <DialogHeader>
                <DialogTitle>創始會員小測驗 (1分鐘)</DialogTitle>
                <DialogDescription>
                    您的回饋將幫助我們打造最棒的產品！({currentStep + 1}/{surveyQuestions.length})
                </DialogDescription>
            </DialogHeader>
            <DialogContent>
                <p className="font-semibold">{surveyQuestions[currentStep].q}</p>
                <div className="mt-4 space-y-2">
                    {surveyQuestions[currentStep].options.map(option => (
                        <Button key={option} variant="outline" className="w-full justify-start" onClick={() => handleSelect(option)}>
                            {option}
                        </Button>
                    ))}
                </div>
            </DialogContent>
            <DialogFooter className="justify-between">
                <Button variant="ghost" onClick={onClose}>略過</Button>
                {currentStep === surveyQuestions.length - 1 && (
                     <Button onClick={handleSubmit} disabled={!answers[currentStep] || loading}>
                        {loading ? '提交中...' : '完成並提交'}
                    </Button>
                )}
            </DialogFooter>
        </Dialog>
    );
};

export default FoundingSurveyModal;
