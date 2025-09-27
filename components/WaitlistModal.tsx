
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/Dialog';
import { Button } from './ui/Button';
import { WaitlistInput } from '../types/domain';
import useAuthStore from '../state/useAuthStore';
import { getUtm } from '../lib/utm';
import { submitWaitlist } from '../lib/api';
import { toast } from './ui/Toast';
import { track } from '../lib/track';
import useWaitlistStore from '../state/useWaitlistStore';
import useUiStore from '../state/useUiStore';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose }) => {
    const { user } = useAuthStore();
    const { setHasJoined } = useWaitlistStore();
    const { openSurveyModal } = useUiStore();
    // Fix: The form state for `agree` should be a boolean, which differs from the `WaitlistInput` type.
    // Omit the original `agree` type and add `agree: boolean` for the component's state.
    const [formData, setFormData] = useState<Omit<Partial<WaitlistInput>, 'agree'> & { agree: boolean }>({
        email: user?.email || '',
        agree: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = '請輸入有效的 Email';
        if (!formData.name) newErrors.name = '請輸入姓名';
        if (!formData.grade) newErrors.grade = '請選擇年級';
        if (!formData.examYear) newErrors.examYear = '請選擇考試年份';
        if (!formData.targetScoreLevel) newErrors.targetScoreLevel = '請選擇目標級分';
        if (!formData.agree) newErrors.agree = '請同意服務條款';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        
        setLoading(true);
        const utm = getUtm() || undefined;
        const submissionData = { ...formData, utm, agree: true } as WaitlistInput;

        try {
            await submitWaitlist(submissionData);
            track('submit_waitlist', { fields: submissionData, utm });
            toast('已寄出《Top 10 文法學霸筆記》到你的信箱 🎉', 'success');
            track('email_sent');
            setHasJoined(true);
            onClose();
            openSurveyModal();
        } catch (error) {
            console.error('Waitlist submission failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <DialogHeader>
                <DialogTitle>Join the Waiting List</DialogTitle>
                <DialogDescription>
                    解鎖完整學習報告，並搶先獲得創始會員資格。
                </DialogDescription>
            </DialogHeader>
            <DialogContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Form Fields */}
                    <div>
                        <label>Email</label>
                        <input name="email" type="email" value={formData.email} onChange={handleChange} disabled={!!user?.email} className="w-full p-2 border rounded mt-1 bg-muted/50" />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                     <div>
                        <label>姓名</label>
                        <input name="name" type="text" value={formData.name || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1 bg-background" />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label>年級</label>
                           <select name="grade" value={formData.grade || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1 bg-background">
                            <option value="">請選擇</option>
                            <option>高一</option><option>高二</option><option>高三</option><option>重考班</option><option>其他</option>
                           </select>
                           {errors.grade && <p className="text-red-500 text-sm mt-1">{errors.grade}</p>}
                        </div>
                        <div>
                           <label>考試年份</label>
                           <select name="examYear" value={formData.examYear || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1 bg-background">
                            <option value="">請選擇</option>
                            <option>2026</option><option>2027</option><option>其他</option>
                           </select>
                           {errors.examYear && <p className="text-red-500 text-sm mt-1">{errors.examYear}</p>}
                        </div>
                    </div>
                     <div>
                        <label>目標級分</label>
                        <select name="targetScoreLevel" value={formData.targetScoreLevel || ''} onChange={handleChange} className="w-full p-2 border rounded mt-1 bg-background">
                            <option value="">請選擇</option>
                            {Array.from({length: 15}, (_, i) => 15 - i).map(level => <option key={level} value={level}>{level}</option>)}
                        </select>
                        {errors.targetScoreLevel && <p className="text-red-500 text-sm mt-1">{errors.targetScoreLevel}</p>}
                    </div>
                    {/* Agreement */}
                    <div className="flex items-start">
                        <input id="agree" name="agree" type="checkbox" checked={formData.agree} onChange={handleChange} className="h-4 w-4 mt-1" />
                        <label htmlFor="agree" className="ml-2 text-sm text-muted-foreground">我同意服務條款與隱私權政策</label>
                    </div>
                    {errors.agree && <p className="text-red-500 text-sm mt-1">{errors.agree}</p>}
                    <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default WaitlistModal;
