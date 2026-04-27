import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    globals: true,
    setupFiles: './vitest.setup.ts',
    environment: 'node',
    environmentMatchGlobs: [['**/__tests__/components/**', 'jsdom']],
  },
});
