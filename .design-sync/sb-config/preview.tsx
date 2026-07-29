// Trimmed preview used for BOTH the design-sync reference storybook build and
// the converter's decorator bundle (cfg.storybookConfigDir points here). The
// repo's real preview.tsx wraps in BrowserRouter > ThemeProvider > CssBaseline
// > UserDetailsProvider > UserGeoLocationProvider, but:
//  - CssBaseline resolves to `undefined` in the converter's decorator bundle and
//    crashes the mount (MUI styled-engine-sc mismatch), and
//  - the synced PRIMITIVES don't need the user/geo app-context providers.
// So the decorator chain here is the minimal one primitives actually require:
// Router (Link/Navbar), MUI ThemeProvider (psycron theme), and i18n. Using the
// same file for the reference build keeps both render sides identical for grading.
import React from 'react';
import { ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

import i18n from '../../src/i18n';
import theme from '../../src/theme';

const preview = {
	decorators: [
		(Story: React.ComponentType) => (
			<BrowserRouter>
				<ThemeProvider theme={theme}>
					<I18nextProvider i18n={i18n}>
						<Story />
					</I18nextProvider>
				</ThemeProvider>
			</BrowserRouter>
		),
	],
	parameters: {
		viewMode: 'story',
	},
	initialGlobals: {
		locale: 'en_US',
	},
};

export default preview;
