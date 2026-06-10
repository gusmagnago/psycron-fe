import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { isMobileMedia } from '@psycron/theme/media-queries/mediaQueries';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const WorkspaceHeaderRoot = styled(Box)`
	min-height: 104px;
	padding: ${spacing.medium} ${spacing.medium} ${spacing.mediumSmall};
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: ${spacing.mediumSmall};
	border-bottom: 1px solid ${hexToRgba(palette.gray['02'], 0.78)};
	position: relative;
	flex-shrink: 0;

	${isMobileMedia} {
		min-height: 0;
		padding: ${spacing.small};
		flex-direction: column;
	}
`;

export const WorkspaceHeaderTitle = styled((props) => (
	<Text component='h1' {...props} />
))`
	margin: 0 0 ${spacing.xs};
	color: ${palette.text.primary};
	font-size: 32px;
	line-height: 1.12;
	letter-spacing: 0;
	font-weight: 800;

	${isMobileMedia} {
		font-size: 26px;
	}
`;

export const WorkspaceHeaderSubtitle = styled(Text)`
	display: block;
	max-width: 740px;
	color: ${palette.text.secondary};
	font-size: 15px;
	line-height: 1.5;

	${isMobileMedia} {
		display: none;
	}
`;

export const WorkspaceHeaderActions = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: ${spacing.extraSmall};
	flex-wrap: wrap;

	${isMobileMedia} {
		justify-content: flex-start;
	}
`;
