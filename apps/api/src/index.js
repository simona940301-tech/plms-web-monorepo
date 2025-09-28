const express = require('express');
const cors = require('cors');

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
app.use(cors({ origin: true, credentials: true }));

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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[api] listening on http://localhost:${PORT}`);
});
