import { Box, css, styled } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import {
	isBiggerThanTabletMedia,
	isMobileMedia,
	isSmallerThanTabletMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowPress } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const EditUserFormContainer = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.medium};
	max-width: 60%;
	min-height: 0;
	margin-bottom: -16.2rem;

	${isSmallerThanTabletMedia} {
		overflow-y: auto;
		max-height: calc(100dvh - 16.2rem);
		max-width: 100%;
	}
`;

export const EditUserWrapper = styled(Box)`
	width: 100%;

	${isBiggerThanTabletMedia} {
		width: 50%;
	}
`;

export const EditingBox = styled(Box, {
	shouldForwardProp: (props) => props !== 'isEditing',
})<{ isEditing?: boolean }>`
	padding: ${spacing.mediumLarge};
	padding-bottom: ${spacing.medium};

	${({ isEditing }) =>
		isEditing
			? css`
					border: 1px solid ${palette.secondary.main};
					border-radius: calc(2 * ${spacing.mediumSmall});
					box-shadow: ${shadowPress};
					margin: ${spacing.small} 0;
				`
			: css``};
`;

export const EditButton = styled(Box)`
	width: 100%;
	display: flex;
	justify-content: flex-start;

	${isBiggerThanTabletMedia} {
		justify-content: flex-end;
	}
`;

export const EditUserDetailsAvatarWrapper = styled(Box)`
	display: flex;
	align-items: center;
	gap: ${spacing.small};
`;

export const EditUserDetailsMarketingConsentLabel = styled(Text)`
	display: flex;
	white-space: normal;
	overflow-wrap: anywhere;

	${isMobileMedia} {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100%;
		align-items: flex-start;
		text-align: left;
	}
`;

export const EditUserDetailsMarketingConsentWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: ${spacing.small};
`;

export const EditUserDetailsMarketingSwitcher = styled(Box)`
	display: flex;
	padding-left: ${spacing.small};

	${isMobileMedia} {
		width: 100%;
		& label {
			width: 100%;

			.MuiFormControlLabel-label {
				width: 100%;
			}
		}
	}
`;
