// .storybook/preview.tsx
import React from 'react';
import i18n from '../src/i18n.ts';
import { ThemeProvider, CssBaseline } from '@mui/material';

import theme from '../src/theme';

const preview = {
  decorators: [
    (Story, context) => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Story {...context} />
      </ThemeProvider>
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
