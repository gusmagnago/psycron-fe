import { defineConfig } from 'vitest/config';

// Unit tests only cover pure utilities (node environment, no jsdom).
// E2E coverage lives in Playwright (npm run test:e2e).
export default defineConfig({
	test: {
		environment: 'node',
		include: ['src/**/*.test.ts'],
	},
});
