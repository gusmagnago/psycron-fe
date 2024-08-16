import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react({ jsxImportSource: '@emotion/react' }),
		viteCompression({
			algorithm: 'gzip', // Você pode usar 'brotliCompress' também
		}),
	],
	resolve: {
		alias: {
			'@psycron': path.resolve(__dirname, './src'),
		},
	},
});
