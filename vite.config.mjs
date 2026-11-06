import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
      '/ws': {
        target: 'ws://127.0.0.1:3000',
        ws: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        home: resolve(root, 'index.html'),
        basics: resolve(root, 'labs/00-basics/index.html'),
        network: resolve(root, 'labs/01-network/index.html'),
        bundles: resolve(root, 'labs/02-bundles/index.html'),
        obfuscation: resolve(root, 'labs/03-obfuscation/index.html'),
        crypto: resolve(root, 'labs/04-crypto/index.html'),
        storage: resolve(root, 'labs/05-storage/index.html'),
        websocket: resolve(root, 'labs/06-websocket/index.html'),
        finalCase: resolve(root, 'labs/07-final-case/index.html'),
        trace: resolve(root, 'labs/08-trace/index.html'),
      },
    },
  },
});
