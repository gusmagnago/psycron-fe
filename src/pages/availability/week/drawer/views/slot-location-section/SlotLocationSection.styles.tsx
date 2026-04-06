import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { Text } from '@psycron/components/text/Text';
import { palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

// ─── Location section card (SlotLocationSection) ──────────────────────────────

export const LocationSection = styled(Box)`
	border: 1px solid ${palette.brand.purple};
	border-radius: ${spacing.mediumSmall};
	padding: ${spacing.small};
	display: flex;
	flex-direction: column;
	gap: ${spacing.extraSmall};
`;

export const LocationSectionLabel = styled(Text)`
	font-size: 0.8rem;
	color: ${palette.gray['05']};
	font-weight: 500;
`;

export const LocationChoiceGrid = styled(Box)`
	gap: ${spacing.xs};
	display: flex;
`;

export const LocationChoiceCard = styled(Button)`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: ${spacing.space};
	padding: ${spacing.xs};
	border-radius: ${spacing.small};
	height: auto;
	width: 100%;

	& svg {
		stroke-width: 2px;
	}
`;

export const LocationChoiceCardLabel = styled(Text)`
	text-align: center;
`;

export const LocationChoiceSubtitle = styled(Text)`
	font-size: 0.8rem;
	text-align: left;
	color: ${palette.gray['05']};
`;

export const CustomAddressWrapper = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	padding-top: ${spacing.xs};
	border-top: 1px solid ${palette.gray['01']};
`;
