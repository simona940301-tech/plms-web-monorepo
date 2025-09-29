import { initializeApp } from 'firebase/app';
import {
    getAuth,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
    User,
    Auth,
} from 'firebase/auth';

// Firebase configuration with proper error handling
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Debug log in development
if (import.meta.env.DEV) {
    console.log('Firebase config:', firebaseConfig);
}

let auth: Auth | null = null;

if (firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId) {
    try {
        const app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        console.log('Firebase Auth initialized successfully');
    } catch (error) {
        console.error('Firebase initialization failed:', error);
    }
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
