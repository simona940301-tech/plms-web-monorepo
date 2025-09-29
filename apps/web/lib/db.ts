import { initializeApp } from 'firebase/app';
import { getFirestore, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { doc, setDoc } from 'firebase/firestore';

const cfg = {
  apiKey: (import.meta as any)?.env?.VITE_FIREBASE_API_KEY,
  authDomain: (import.meta as any)?.env?.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: (import.meta as any)?.env?.VITE_FIREBASE_PROJECT_ID,
};

let db: ReturnType<typeof getFirestore> | null = null;
export function getDb() {
  if (!cfg.apiKey) return null;
  if (db) return db;
  const app = initializeApp(cfg);
  db = getFirestore(app);
  return db;
}

export async function addToWaitingList(data: Record<string, any>) {
  const database = getDb();
  if (!database) throw new Error('Firestore is not configured');
  const doc = await addDoc(collection(database, 'waiting_list'), {
    ...data,
    created_at: serverTimestamp(),
  });
  return { id: doc.id };
}

export async function addRsAttempt(data: Record<string, any>) {
  const database = getDb();
  if (!database) throw new Error('Firestore is not configured');
  const doc = await addDoc(collection(database, 'rs_attempts'), {
    ...data,
    created_at: serverTimestamp(),
  });
  return { id: doc.id };
}

export async function upsert_user(uid: string, data: Record<string, any>) {
  const database = getDb();
  if (!database) throw new Error('Firestore is not configured');
  await setDoc(doc(database, 'users', uid), { ...data, updated_at: serverTimestamp(), created_at: serverTimestamp() }, { merge: true });
}

export async function set_onboarding(uid: string, step: number, payload: Record<string, any>) {
  const database = getDb();
  if (!database) throw new Error('Firestore is not configured');
  const { completed, ...rest } = payload || {};
  const data = {
    onboarding: { step, completed: completed ?? false, ...rest },
    updated_at: serverTimestamp(),
  };
  await setDoc(doc(database, 'users', uid), data, { merge: true });
}
