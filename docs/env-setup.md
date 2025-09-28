Environment setup (Web + API)

Web (Vercel)
- Project → Settings → Environment Variables (Production + Preview)
  - VITE_GTM_ID=GTM-M82RNXD7
  - VITE_FIREBASE_API_KEY=AIzaSyAOqmS9tT6fjpyoYfrYmRY5itHYU1sXh9s
  - VITE_FIREBASE_AUTH_DOMAIN=plms-tw.firebaseapp.com
  - VITE_FIREBASE_PROJECT_ID=plms-tw
  - VITE_FIREBASE_STORAGE_BUCKET=plms-tw.firebasestorage.app
  - VITE_FIREBASE_MESSAGING_SENDER_ID=761623827343
  - VITE_FIREBASE_APP_ID=1:761623827343:web:11f6d56c733cae0a1d71fa
  - VITE_FIREBASE_MEASUREMENT_ID=G-RP8T7SQMXY
  - VITE_API_BASE=https://plms-api-761623827343.us-central1.run.app

API (Cloud Run)
- Required env (one of):
  - GOOGLE_APPLICATION_CREDENTIALS (mounted secret file) or
  - FIREBASE_SERVICE_ACCOUNT_JSON (inline JSON)
- Optional:
  - CORS_ORIGINS="https://promo.xuerenjing.com,http://localhost:3000"

Test API
- Health: curl -s https://plms-api-761623827343.us-central1.run.app/health
- Waitlist:
  curl -s -X POST \
    -H 'Content-Type: application/json' \
    -d '{"email":"test@example.com","name":"Test","grade":"高三","utm":{"utm_source":"test"}}' \
    https://plms-api-761623827343.us-central1.run.app/waitlist

Redeploy web after changing envs: Vercel → Deployments → Redeploy (uncheck build cache)

