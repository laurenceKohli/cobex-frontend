import { defineConfig } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ command, mode }) => {

  const config = {
    base: '/',
    plugins: [
      vue()
    ],
    server: {
      proxy : {
        '/api': {
          //target: 'https://cobex-uu6t.onrender.com',
          target: 'http://localhost:5000',
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        '/utils': path.resolve(__dirname, 'src/utils'),
        '/class': path.resolve(__dirname, 'src/class'),
      },
    },
    root: path.resolve(__dirname, 'src/frontend'),
    build: {
      rollupOptions: {
        input: path.resolve(__dirname, 'src/frontend') + '/index.html',
      }
    }
  };

  return config;
});