/**
 * i18n key completeness — static analysis test (no browser needed).
 *
 * Verifies that every key present in the English translation file
 * also exists in the Portuguese file, and vice versa, with no gaps.
 * This test runs in Node context via Playwright's `test` runner.
 */
import { expect, test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '../../src/assets/locales');

const readJson = (locale: string): Record<string, unknown> => {
	const filePath = path.join(ROOT, locale, 'translation.json');
	const raw = fs.readFileSync(filePath, 'utf-8');
	return JSON.parse(raw) as Record<string, unknown>;
};

const flattenKeys = (obj: Record<string, unknown>, prefix = ''): string[] => {
	const keys: string[] = [];

	for (const [key, value] of Object.entries(obj)) {
		const fullKey = prefix ? `${prefix}.${key}` : key;

		if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
			keys.push(...flattenKeys(value as Record<string, unknown>, fullKey));
		} else {
			keys.push(fullKey);
		}
	}

	return keys;
};

test.describe('Translation key completeness', () => {
	test('all English keys exist in Portuguese', () => {
		const en = flattenKeys(readJson('en'));
		const pt = flattenKeys(readJson('pt'));
		const ptSet = new Set(pt);

		const missingInPt = en.filter((key) => !ptSet.has(key));

		expect(
			missingInPt,
			`Keys in EN missing from PT:\n  ${missingInPt.join('\n  ')}`
		).toHaveLength(0);
	});

	test('all Portuguese keys exist in English', () => {
		const en = flattenKeys(readJson('en'));
		const pt = flattenKeys(readJson('pt'));
		const enSet = new Set(en);

		const missingInEn = pt.filter((key) => !enSet.has(key));

		expect(
			missingInEn,
			`Keys in PT missing from EN:\n  ${missingInEn.join('\n  ')}`
		).toHaveLength(0);
	});
});
