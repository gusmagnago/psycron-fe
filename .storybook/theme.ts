import { create } from '@storybook/theming/create';

export default create({
  base: 'light',
  brandTitle: 'Psycron',
  brandUrl: 'https://psycron.app',
  brandImage: 'src/assets/psycron-logo.svg',
  brandTarget: '_self',
  textColor: '#060B0E',

  fontBase: '"Inter", sans-serif',
  fontCode: 'monospace',

  colorPrimary: '#A9DEF9',
  colorSecondary: '#FF99C8',

  appBg: '#F7FAFA',
  appContentBg: '#F7FAFA',
  appPreviewBg: '#F7FAFA',
  appBorderColor: '#A9DEF9',
  appBorderRadius: 40,

  barTextColor: '#060B0E',
  barSelectedColor: '#484C4E',
  barHoverColor: '#7BA8BE',
  barBg: '#F7FAFA',
});
