import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { isMobileMedia } from '@psycron/theme/media-queries/mediaQueries';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const ConflictStatusPill = styled(Box)`
	align-items: center;
	background: ${hexToRgba(palette.info.main, 0.1)};
	border: 1px solid ${hexToRgba(palette.info.main, 0.16)};
	border-radius: 999px;
	color: ${palette.info.main};
	display: inline-flex;
	font-size: 0.72rem;
	font-weight: 700;
	padding: 0.15rem ${spacing.xs};
	text-transform: uppercase;

	${isMobileMedia} {
		font-size: 0.68rem;
	}
`;

export const ConflictCardDate = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.8rem;
`;

export const ConflictTypeLabel = styled(Text)`
	color: var(--feature-page-accent, ${palette.secondary.main});
	font-size: 0.75rem;
	font-weight: 700;
	text-transform: uppercase;
`;

export const ConflictTitle = styled(Text)`
	color: ${palette.text.primary};
	font-size: 0.98rem;
	font-weight: 700;

	${isMobileMedia} {
		font-size: 0.95rem;
	}
`;

export const ConflictDescription = styled(Text)`
	color: ${palette.gray['05']};
	font-size: 0.88rem;
	line-height: 1.55;

	${isMobileMedia} {
		font-size: 0.84rem;
	}
`;
