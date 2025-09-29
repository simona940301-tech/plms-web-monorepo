# 🚀 GitHub Secrets 快速設定指南

## 📍 直接連結
**GitHub Secrets 設定頁面：**
https://github.com/simona940301-tech/plus-web-monorepo/settings/secrets/actions

## 🔑 需要設定的 Secrets

### 1. Vercel 相關
| Secret 名稱 | 如何取得 |
|------------|----------|
| `VERCEL_TOKEN` | https://vercel.com/account/tokens → Create Token |
| `VERCEL_ORG_ID` | https://vercel.com/dashboard → 專案 → Settings → General |
| `VERCEL_PROJECT_ID` | https://vercel.com/dashboard → 專案 → Settings → General |

### 2. Cloudflare 相關
| Secret 名稱 | 如何取得 |
|------------|----------|
| `CLOUDFLARE_ZONE_ID` | https://dash.cloudflare.com/ → 網域 → Overview |
| `CLOUDFLARE_API_TOKEN` | https://dash.cloudflare.com/profile/api-tokens → Create Token |

### 3. 應用程式相關
| Secret 名稱 | 說明 |
|------------|------|
| `VITE_FIREBASE_API_KEY` | Firebase 專案設定 |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase 專案設定 |
| `VITE_FIREBASE_PROJECT_ID` | Firebase 專案設定 |
| `VITE_FIREBASE_APP_ID` | Firebase 專案設定 |
| `VITE_GTM_ID` | Google Tag Manager ID |
| `GEMINI_API_KEY` | Gemini API Key |

## ⚡ 快速設定步驟

1. **點擊上方 GitHub 連結**
2. **點擊 "New repository secret"**
3. **逐一新增所有 secrets**
4. **完成後執行測試部署**

## 🧪 測試自動部署

設定完成後，執行：
```bash
git add .
git commit -m "feat: setup automated deployment pipeline"
git push origin main
```

## ✅ 驗證部署

1. 進入 GitHub Actions 頁面查看部署狀態
2. 部署完成後訪問 https://promo.xuerenjing.com/
3. 確認頁面正常顯示且樣式正確
