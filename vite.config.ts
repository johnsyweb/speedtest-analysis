import { defineConfig } from 'vite';

export default defineConfig({
  base: '/speedtest-analysis/',
  root: 'web',
  build: {
    outDir: '../dist-web',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    open: true,
  },
});
