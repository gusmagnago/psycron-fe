import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { ThemeProvider } from '@mui/material';

import '@psycron/index.css';

import i18n from './i18n';
import AppRouter from './routes';
import theme from './theme';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<I18nextProvider i18n={i18n}>
			<ThemeProvider theme={theme}>
				<AppRouter />
			</ThemeProvider>
		</I18nextProvider>
	</React.StrictMode>
);
