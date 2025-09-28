const express = require('express');
const cors = require('cors');
const { z } = require('zod');

// Optional Firebase Admin bootstrap
let admin = null;
try {
  admin = require('firebase-admin');
  if (!admin.apps.length) {
    // Two ways to init:
    // 1) GOOGLE_APPLICATION_CREDENTIALS points to a JSON file
    // 2) FIREBASE_SERVICE_ACCOUNT_JSON env contains the JSON content
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const creds = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      admin.initializeApp({ credential: admin.credential.cert(creds) });
      // eslint-disable-next-line no-console
      console.log('[api] Firebase Admin initialized from FIREBASE_SERVICE_ACCOUNT_JSON');
    } else {
      admin.initializeApp();
      // eslint-disable-next-line no-console
      console.log('[api] Firebase Admin initialized via GOOGLE_APPLICATION_CREDENTIALS (if set)');
    }
  }
} catch (e) {
  // eslint-disable-next-line no-console
  console.log('[api] Firebase Admin not configured yet (this is fine for local dev).');
}

const app = express();
app.use(express.json());
// CORS allowlist via env CORS_ORIGINS (comma separated)
const allow = (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',').map(s => s.trim());
app.use(cors({ origin: allow, credentials: true }));

// Optional auth middleware using Firebase ID tokens
async function authRequired(req, res, next) {
  try {
    if (!admin) return res.status(501).json({ error: 'auth not configured' });
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'missing bearer token' });
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded; // attach user
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid token' });
  }
}

// Healthcheck
app.get('/health', (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'development' });
});

// Example API endpoint
app.get('/api/v1/version', (req, res) => {
  res.json({ name: 'plms-api', version: '0.1.0' });
});

// Example: authenticated endpoint using Firebase (optional)
app.get('/api/v1/me', authRequired, async (req, res) => {
  return res.json({ uid: req.user.uid, claims: req.user });
});

// Waitlist endpoint (server writes to Firestore)
const WaitlistInput = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  grade: z.string().min(1),
  target_major: z.string().optional().nullable(),
  utm: z.record(z.string()).optional(),
});

app.post('/waitlist', async (req, res) => {
  try {
    if (!admin) return res.status(501).json({ ok:false, code:'DB_NOT_CONFIGURED', message:'Firebase Admin not configured' });
    const parsed = WaitlistInput.safeParse(req.body || {});
    if (!parsed.success) {
      return res.status(400).json({ ok:false, code:'VALIDATION', message:'invalid body', issues: parsed.error.issues });
    }
    const { email, name, grade, target_major, utm } = parsed.data;
    const db = admin.firestore();
    const doc = await db.collection('waiting_list').add({
      email,
      name,
      grade,
      target_major: target_major ?? null,
      utm: utm || null,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    return res.status(201).json({ ok:true, id: doc.id });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok:false, code:'INTERNAL', message:'Server error' });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[api] listening on http://localhost:${PORT}`);
});
