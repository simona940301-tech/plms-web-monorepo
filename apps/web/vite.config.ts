import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'child_process';

// 生成版本號
function getVersion() {
  try {
    const commitHash = execSync('git rev-parse --short HEAD').toString().trim();
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `${timestamp}-${commitHash}`;
  } catch {
    return new Date().toISOString().slice(0, 10).replace(/-/g, '');
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const version = getVersion();
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.VITE_FIREBASE_API_KEY': JSON.stringify(env.VITE_FIREBASE_API_KEY),
      'process.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(env.VITE_FIREBASE_AUTH_DOMAIN),
      'process.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(env.VITE_FIREBASE_PROJECT_ID),
      'process.env.VITE_FIREBASE_APP_ID': JSON.stringify(env.VITE_FIREBASE_APP_ID),
      'process.env.VITE_GTM_ID': JSON.stringify(env.VITE_GTM_ID),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      '__APP_VERSION__': JSON.stringify(version)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      rollupOptions: {
        external: [],
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            firebase: ['firebase/app', 'firebase/auth'],
          }
        }
      }
    }
  };
});
