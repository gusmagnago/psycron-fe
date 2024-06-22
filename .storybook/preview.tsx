// .storybook/preview.tsx
import React from 'react';
import i18n from '../src/i18n.ts';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

import theme from '../src/theme';

const preview = {
  decorators: [
    (Story, context) => (
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Story {...context} />
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
        order: ['Introduction', 'Elements', 'Components'],
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
