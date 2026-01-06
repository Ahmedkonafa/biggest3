
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'node:process';

export default defineConfig(({ mode }) => {
  // تحميل متغيرات البيئة بناءً على المجلد الحالي
  // Fixing: Property 'cwd' does not exist on type 'Process'
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // إرسال المفتاح إلى المتصفح سواء كان من النظام أو من ملف .env
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY || '')
    },
    server: {
      port: 3000,
      host: true
    },
    build: {
      outDir: 'dist',
      chunkSizeWarningLimit: 1600
    }
  };
});
