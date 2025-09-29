# 環境變數設定說明

## GitHub Secrets 設定

在 GitHub Repository → Settings → Secrets and variables → Actions 中新增以下 secrets：

### Vercel 相關
- `VERCEL_TOKEN`: Vercel API Token (從 Vercel Dashboard → Settings → Tokens 取得)
- `VERCEL_ORG_ID`: Vercel Organization ID (從 Vercel Dashboard → Settings → General 取得)
- `VERCEL_PROJECT_ID`: Vercel Project ID (從 Vercel Dashboard → Settings → General 取得)

### Cloudflare 相關
- `CLOUDFLARE_ZONE_ID`: Cloudflare Zone ID (從 Cloudflare Dashboard → Overview 取得)
- `CLOUDFLARE_API_TOKEN`: Cloudflare API Token (從 Cloudflare Dashboard → My Profile → API Tokens 建立)

### 應用程式相關
- `VITE_FIREBASE_API_KEY`: Firebase API Key
- `VITE_FIREBASE_AUTH_DOMAIN`: Firebase Auth Domain
- `VITE_FIREBASE_PROJECT_ID`: Firebase Project ID
- `VITE_FIREBASE_APP_ID`: Firebase App ID
- `VITE_GTM_ID`: Google Tag Manager ID
- `GEMINI_API_KEY`: Gemini API Key

## 設定步驟

1. 登入 GitHub Repository
2. 進入 Settings → Secrets and variables → Actions
3. 點擊 "New repository secret"
4. 逐一新增上述所有 secrets
5. 完成後，每次 push 到 main 分支就會自動部署並清除快取

## 測試自動部署

```bash
git add .
git commit -m "feat: setup automated deployment pipeline"
git push origin main
```

部署完成後，GitHub Actions 會自動：
1. 建置應用程式
2. 部署到 Vercel
3. 清除 Cloudflare 快取
4. 通知部署狀態
