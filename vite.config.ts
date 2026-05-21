import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
	plugins: [
		react({
			jsxImportSource: '@emotion/react',
		}),
		viteCompression({ algorithm: 'gzip' }),
	],
	resolve: {
		alias: {
			'@psycron': path.resolve(__dirname, './src'),
		},
	},
	server: {
		host: true,
		port: 5173,
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					'vendor-react': ['react', 'react-dom', 'react-router-dom'],
					'vendor-mui': ['@mui/material', '@emotion/react', '@emotion/styled'],
					'vendor-query': ['@tanstack/react-query'],
					'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
					'vendor-dates': ['date-fns', 'date-fns-tz'],
				},
			},
		},
	},
});
