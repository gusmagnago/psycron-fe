import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Unit tests only cover pure utilities (node environment, no jsdom).
// E2E coverage lives in Playwright (npm run test:e2e).
export default defineConfig({
	resolve: {
		alias: {
			// Mirror the tsconfig "@psycron/*" -> "src/*" path so utilities that
			// import theme tokens resolve under vitest.
			'@psycron': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	test: {
		environment: 'node',
		include: ['src/**/*.test.ts'],
	},
});
