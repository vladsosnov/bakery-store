import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/bakery-store/',
    define: {
      __API_BASE_URL__: JSON.stringify(env.VITE_API_URL ?? '')
    },
    plugins: [react()],
    server: {
      proxy: {
        '/api': 'http://localhost:4000'
      }
    },
    resolve: {
      alias: {
        '@src': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  };
});
