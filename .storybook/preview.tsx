// .storybook/preview.tsx
import React from 'react';
import i18n from '../src/i18n.ts';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

import theme from '../src/theme';

import { UserDetailsProvider } from '../src/context/user/UserDetailsContext';
import { UserGeoLocationProvider } from '../src/context/CountryContext';

const preview = {
  decorators: [
    (Story, context) => (
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <UserDetailsProvider>
            <UserGeoLocationProvider>
              <Story {...context} />
            </UserGeoLocationProvider>
          </UserDetailsProvider>
        </ThemeProvider>
      </BrowserRouter>
    ),
  ],
  globals: {
    locale: 'en_US',
    locales: {
      en: 'English (US)',
      pt: 'Português (BR)',
    },
  },
  parameters: {
    i18n,
    viewMode: 'story',
    options: {
      storySort: {
        order: ['Introduction', 'Elements', 'Components', 'Layouts', 'Pages'],
      },
    },
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
