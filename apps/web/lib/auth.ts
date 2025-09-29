import { initializeApp } from 'firebase/app';
import {
    getAuth,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
    User,
    Auth,
} from 'firebase/auth';

// Fix: Cast import.meta to any to access Vite environment variables.
const firebaseConfig = {
    apiKey: (import.meta as any)?.env?.VITE_FIREBASE_API_KEY,
    authDomain: (import.meta as any)?.env?.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: (import.meta as any)?.env?.VITE_FIREBASE_PROJECT_ID,
};

let auth: Auth | null = null;

if (firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId) {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
} else {
    console.warn("Firebase config is missing, Auth features will be disabled.", firebaseConfig);
}

export { auth };

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export type AuthProviderType = 'google' | 'facebook';

export const signIn = async (providerName: AuthProviderType): Promise<{user: User; idToken: string} | null> => {
    if (!auth) {
        console.error("Authentication failed: Firebase is not configured.");
        return null;
    }
    
    let provider;
    switch (providerName) {
        case 'google':
            provider = googleProvider;
            break;
        case 'facebook':
            provider = facebookProvider;
            break;
        default:
            throw new Error('Unsupported provider');
    }

    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const idToken = await user.getIdToken();
        return { user, idToken };
    } catch (error) {
        console.error(`Sign in with ${providerName} failed:`, error);
        return null;
    }
};
