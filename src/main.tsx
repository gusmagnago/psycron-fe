import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import ReactGA from 'react-ga4';
import { ThemeProvider } from '@mui/material';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import '@psycron/index.css';

import i18n from './i18n';
import AppRouter from './routes';
import theme from './theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

ReactGA.initialize(measurementId);

if (measurementId) {
  ReactGA.initialize(measurementId);
  console.log(`GA initialized with measurement ID: ${measurementId}`);
} else {
  console.error('GA measurement ID is missing.');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <AppRouter />
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
      </I18nextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
