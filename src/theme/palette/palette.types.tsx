export type ColorShades = {
  disabled: string;
  hover?: string;
  light?: string;
  press?: string;
};

export type ColorScheme = {
  access: string;
  action: ColorShades;
  dark: string;
  light: string;
  main: string;
  surface: ColorShades;
};

export type TextColors = {
  disabled: string;
  primary: string;
  secondary: string;
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

export type BackgroundShades = {
  default: string;
  paper: string;
};

export type Palette = {
  alert: ColorScheme;
  background: BackgroundShades;
  black: string;
  border: string;
  error: ColorScheme;
  gray: GrayShades;
  info: ColorScheme;
  primary: ColorScheme;
  secondary: ColorScheme;
  success: ColorScheme;
  tertiary: ColorScheme;
  text: TextColors;
};
