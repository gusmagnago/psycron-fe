import { palette } from '../palette/palette.theme';

export const shadowMain =
  '-5px -5px 10px rgba(255, 255, 255, 0.5), 5px 5px 10px rgba(170, 170, 204, 0.25), 10px 10px 20px rgba(170, 170, 204, 0.5), -10px -10px 20px #FFFFFF';
export const shadowPress =
  '5px 5px 10px rgba(170, 170, 204, 0.5), -5px -5px 10px #FFFFFF';

// Pls apply disabled shadow as "filter" key
// checkout here: https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/drop-shadow
export const shadowDisabled =
  'drop-shadow(1px 1px 2px rgba(170, 170, 204, 0.5)) drop-shadow(-1px -1px 2px #FFFFFF)';

export const shadowInnerPress =
  'inset -2px -2px 4px rgba(255, 255, 255, 0.5), inset 2px 2px 4px rgba(170, 170, 204, 0.25), inset 5px 5px 10px rgba(170, 170, 204, 0.5), inset -5px -5px 10px #FFFFFF;';

export const shadowNeon = `0 0 .2rem ${palette.success.main}, 0 0 .2rem ${palette.success.main},   0 0 2rem ${palette.success.main}, 0 0 0.8rem ${palette.primary.main},   0 0 2.8rem ${palette.primary.main}, inset 0 0 1.3rem ${palette.primary.main}`;
