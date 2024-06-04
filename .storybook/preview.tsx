// .storybook/preview.tsx
import React from 'react';
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
  parameters: {
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
