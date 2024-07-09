import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import babel from 'vite-plugin-babel';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({ jsxImportSource: '@emotion/react' }),
    babel({
      babelConfig: {
        plugins: ['babel-plugin-macros'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@psycron': path.resolve(__dirname, './src'),
    },
  },
});
