import path from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';

// Trimmed Storybook config used ONLY to build the design-sync reference
// (.design-sync/sb-reference). The repo's real .storybook/main.ts pulls in
// storybook-react-i18next + @chromatic-com/storybook + @storybook/addon-docs,
// whose manager bundles fail to resolve under Storybook 10 and break
// `storybook build`. The converter only needs the rendered preview iframe and
// the preview.tsx decorators, so we drop the manager-only addons here.
// i18n still works: src/i18n.ts self-initializes i18next as a side effect.
const config: StorybookConfig = {
	// Scoped to PRIMITIVE component dirs only. This keeps the reference roster to
	// the synced primitives AND avoids app-component stories that fail a strict
	// production build (e.g. SignUp.stories imports a non-existent export).
	stories: [
		'../../src/components/{avatar,button,card,checkbox,icons,link,progress,radio,select,slider,switch,table,tooltip}/**/*.stories.@(js|jsx|mjs|ts|tsx)',
	],
	addons: ['@storybook/addon-links', '@storybook/addon-themes'],
	framework: '@storybook/react-vite',
	viteFinal: async (viteConfig) => {
		// Guarantee the @psycron -> ./src alias is present (mirrors vite.config.ts).
		// Storybook is always run from the repo root (see NOTES.md build command).
		const root = process.cwd();
		viteConfig.resolve = viteConfig.resolve ?? {};
		viteConfig.resolve.alias = {
			...(viteConfig.resolve.alias as Record<string, string>),
			'@psycron': path.resolve(root, 'src'),
		};
		return viteConfig;
	},
	previewHead: (head) => `
    ${head}
   <link rel="preconnect" href="https://fonts.googleapis.com" />
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
   <style>
    body {
        font-family: "Inter", sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
    </style>
  `,
};

export default config;
