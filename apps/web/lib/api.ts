import { RSLiteAttemptInput, SurveyInput, WaitlistInput } from '../types/domain';
import useAuthStore from '../state/useAuthStore';
import { getUtm } from './utm';
import { toast } from '../components/ui/Toast';
import { addToWaitingList } from './db';

// Fix: Cast import.meta to any to access Vite environment variables.
const API_BASE = (import.meta as any)?.env?.VITE_API_BASE || '';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const { idToken } = useAuthStore.getState();
    const utm = getUtm();

    const headers = new Headers(options.headers || {});
    if (idToken) {
        headers.set('Authorization', `Bearer ${idToken}`);
    }
    if (utm) {
        Object.entries(utm).forEach(([key, value]) => {
            if (value) headers.set(`x-utm-${key}`, value);
        });
    }
    if (!headers.has('Content-Type') && options.body) {
        headers.set('Content-Type', 'application/json');
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
            throw new Error(errorData.message || `API error: ${response.status}`);
        }

        return response;
    } catch (error) {
        console.error('API call failed:', error);
        toast(error instanceof Error ? error.message : 'Network error', 'error');
        throw error;
    }
}

// Mocking the API for now
const mockApi = <T,>(data: T, delay = 500): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(data), delay));
}


export const submitRSLiteAttempt = async (data: RSLiteAttemptInput) => {
    // const response = await fetchWithAuth('/rslite/attempts', {
    //     method: 'POST',
    //     body: JSON.stringify(data),
    // });
    // return response.json();
    console.log('Submitting RS Lite Attempt:', data);
    return mockApi({ attemptId: `atm_${Date.now()}` });
};

export const submitWaitlist = async (data: WaitlistInput) => {
    const utm = getUtm() || undefined;
    // Prefer API if configured
    if (API_BASE) {
        try {
            const resp = await fetchWithAuth('/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, utm }),
            });
            return await resp.json();
        } catch (e) {
            console.warn('API waitlist failed, falling back to Firestore...', e);
        }
    }
    // Fallback to Firestore (client-side)
    try {
        const res = await addToWaitingList({ ...data, utm } as any);
        return { ok: true, id: res.id };
    } catch (e) {
        console.warn('Firestore not configured; using mock.');
        return mockApi({ ok: true });
    }
};

export const submitFoundingSurvey = async (data: SurveyInput) => {
    // const response = await fetchWithAuth('/founding-survey', {
    //     method: 'POST',
    //     body: JSON.stringify(data),
    // });
    // return response.json();
    console.log('Submitting Founding Survey:', data);
    return mockApi({ ok: true });
};
