import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material';
import App from '@psycron/App.tsx';

import '@psycron/index.css';

import { UserGeoLocationProvider } from './context/CountryContext';
import theme from './theme';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<UserGeoLocationProvider>
				<App />
			</UserGeoLocationProvider>
		</ThemeProvider>
	</React.StrictMode>
);
