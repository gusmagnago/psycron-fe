import { hexToRgba, palette } from '../palette/palette.theme';

export const shadowPress =
	'5px 5px 10px rgba(170, 170, 204, 0.5), -5px -5px 10px #FFFFFF';

// Pls apply disabled shadow as "filter" key
// checkout here: https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/drop-shadow
export const shadowDisabled =
	'drop-shadow(1px 1px 2px rgba(170, 170, 204, 0.5)) drop-shadow(-1px -1px 2px #FFFFFF)';

export const shadowInnerPress =
	'inset -2px -2px 4px rgba(255, 255, 255, 0.5), inset 2px 2px 4px rgba(170, 170, 204, 0.25), inset 5px 5px 10px rgba(170, 170, 204, 0.5), inset -5px -5px 10px #FFFFFF;';

export const shadowNeon = `0 0 .2rem ${palette.success.main}, 0 0 .2rem ${palette.success.main},   0 0 2rem ${palette.success.main}, 0 0 0.8rem ${palette.primary.main},   0 0 2.8rem ${palette.primary.main}, inset 0 0 1.3rem ${palette.primary.main}`;

export const shadowSmall =
	'0px 3px 1px -2px rgba(111, 111, 111, 0.2),0px 2px 2px 0px rgba(112, 112, 112, 0.14),0px 1px 5px 0px rgba(125, 125, 125, 0.12)';

export const shadowMain = '0px 10px 15px -3px rgba(0, 0, 0, 0.1)';

export const shadowMediumPurple = `4px 5px 10px -6px ${palette.brand.purple}`;

export const shadowMediumError = `4px 5px 10px -6px ${palette.error.main}`;

export const shadowSmallPurple = `0px 3px 1px -2px rgba(0, 0, 0, 0.2),0px 2px 2px 0px ${hexToRgba(palette.brand.purple, 0.5)},0px 1px 5px 0px ${hexToRgba(palette.brand.purple, 0.5)}`;

export const shadowSmallError = `0px 3px 1px -2px rgba(0, 0, 0, 0.2),0px 2px 2px 0px ${hexToRgba(palette.error.main, 0.5)},0px 1px 5px 0px ${hexToRgba(palette.error.main, 0.5)}`;
