export type ColorShades = {
  hover?: string;
  press?: string;
  light?: string;
  disabled: string;
};

export type ColorScheme = {
  main: string;
  light: string;
  dark: string;
  access: string;
  action: ColorShades;
  surface: ColorShades;
};

export type TextColors = {
  primary: string;
  secondary: string;
  disabled: string;
};

export type GrayShades = {
  '01': string;
  '02': string;
  '03': string;
  '04': string;
  '05': string;
  '06': string;
  '07': string;
  '08': string;
  '09': string;
  dark: string;
};

export type Palette = {
  primary: ColorScheme;
  secondary: ColorScheme;
  tertiary: ColorScheme;
  text: TextColors;
  success: ColorScheme;
  info: ColorScheme;
  alert: ColorScheme;
  error: ColorScheme;
  background: string;
  black: string;
  border: string;
  gray: GrayShades;
};
