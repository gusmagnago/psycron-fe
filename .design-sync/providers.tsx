// Bundle-native provider chain for design-sync previews.
//
// This module is bundled INTO _ds_bundle.js (via cfg.extraEntries), so the
// MUI ThemeProvider, react-router BrowserRouter, and react-i18next provider
// here use the SAME library instances as the components. cfg.provider points
// at DSProviders, so every preview mounts inside this chain and the psycron
// THEME context actually reaches the components. (The storybook decorators run
// in a separate bundle whose contexts can't cross into _ds_bundle.js, which is
// why decorator-provided theming rendered every component un-themed.)
import React from 'react';
import { ThemeProvider } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

import i18n from '@psycron/i18n';
import theme from '@psycron/theme';

export const DSProviders = ({ children }: { children?: React.ReactNode }) => (
	<BrowserRouter>
		<ThemeProvider theme={theme}>
			<I18nextProvider i18n={i18n}>{children}</I18nextProvider>
		</ThemeProvider>
	</BrowserRouter>
);
