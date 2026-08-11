import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // مسارات نسبية
  build: {
    outDir: 'docs', // نضع المخرجات في مجلد docs
    emptyOutDir: true,
  },
  server: {
    port: 3000,
  },
});
