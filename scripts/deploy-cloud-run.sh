#!/usr/bin/env bash
set -euo pipefail

# Deploy apps/api to Cloud Run using gcloud
# Requirements:
# - gcloud CLI authenticated
# - PROJECT_ID env set (e.g., export PROJECT_ID=plms-tw)
# - REGION optional (default: us-central1)

SERVICE=${SERVICE:-plms-api}
PROJECT_ID=${PROJECT_ID:?set PROJECT_ID}
REGION=${REGION:-us-central1}

cd "$(dirname "$0")/.."

echo "[cloud-run] building container via Cloud Build..."
gcloud builds submit apps/api --tag "gcr.io/${PROJECT_ID}/${SERVICE}:latest" --project "${PROJECT_ID}"

echo "[cloud-run] deploying to Cloud Run..."
gcloud run deploy "${SERVICE}" \
  --image "gcr.io/${PROJECT_ID}/${SERVICE}:latest" \
  --platform managed \
  --region "${REGION}" \
  --allow-unauthenticated \
  --port 8080 \
  --project "${PROJECT_ID}"

echo "[cloud-run] done. Remember to configure env vars/secrets as needed."

