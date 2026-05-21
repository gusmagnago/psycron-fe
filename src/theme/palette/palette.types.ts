export type InteractionState = {
	disabled: string;
	hover: string;
	light?: string;
	press: string;
};

export type SurfaceState = {
	disabled: string;
	hover?: string;
	light?: string;
	press?: string;
};

export type ColorScheme = {
	access: string;
	action: InteractionState;
	dark: string;
	light: string;
	main: string;
	surface: SurfaceState;
};

export type TextColors = {
	disabled: string;
	primary: string;
	secondary: string;
};

export type GrayScaleKey =
	| '00'
	| '01'
	| '02'
	| '03'
	| '04'
	| '05'
	| '06'
	| '07'
	| '08'
	| '09';

export type GrayShades = Record<GrayScaleKey, string> & {
	dark: string;
};

export type BackgroundShades = {
	default: string;
	paper: string;
};

export type BrandShades = {
	dark: string;
	google: string;
	light: string;
	purple: string;
};

export type SemanticColors = {
	alert: ColorScheme;
	error: ColorScheme;
	info: ColorScheme;
	primary: ColorScheme;
	secondary: ColorScheme;
	success: ColorScheme;
	tertiary: ColorScheme;
	warning: ColorScheme;
};

export type NeutralColors = {
	background: BackgroundShades;
	gray: GrayShades;
	text: TextColors;
};

export type BrandColors = {
	brand: BrandShades;
};

export type BaseColors = {
	black: string;
	border: string;
	white: string;
};

export type AppPalette = SemanticColors &
	NeutralColors &
	BrandColors &
	BaseColors;

export type VariantStateOptions = {
	backgroundColor?: string;
	borderColor?: string;
	color?: string;
};

export type ContainedVariantOptions = {
	action: InteractionState;
	backgroundColor: string;
	borderColor?: string;
	color?: string;
	disabled?: VariantStateOptions;
	focus?: VariantStateOptions;
	hover?: VariantStateOptions;
};

export type OutlinedVariantOptions = {
	action: InteractionState;
	backgroundColor?: string;
	borderColor: string;
	color?: string;
	disabled?: VariantStateOptions;
	focus?: VariantStateOptions;
	hover?: VariantStateOptions;
};
