import { css, Global } from '@emotion/react';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowPress } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { zIndexModal } from '@psycron/theme/zIndex';

export const GoogleAutocompleteGlobalStyles = () => (
	<Global
		styles={css`
			.pac-container {
				box-shadow: ${shadowPress};
				z-index: ${zIndexModal + 1} !important;
				border-radius: ${spacing.mediumSmall};
				padding: ${spacing.small};
				font-family: 'Inter', sans-serif;
				.pac-icon {
					filter: invert(35%) sepia(80%) saturate(600%) hue-rotate(240deg)
						brightness(90%);
				}
				.pac-item {
					padding: ${spacing.extraSmall};
					.pac-item-query {
						font-size: 0.8rem;
						color: ${palette.brand.purple};
						.pac-matched {
							font-size: 1rem;
							color: ${palette.brand.dark};
						}
					}
				}
			}
		`}
	/>
);
