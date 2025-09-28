#!/usr/bin/env bash
set -euo pipefail
PROJECT_ID=${PROJECT_ID:?set PROJECT_ID}
firebase deploy --project "$PROJECT_ID" --only firestore:rules

