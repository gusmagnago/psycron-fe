import styled from '@emotion/styled';
import { Box, Tab, Tabs } from '@mui/material';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

export const SectionTabsWrapper = styled(Box)`
	flex-shrink: 0;
`;

export const StyledSectionTabs = styled(Tabs)`
	min-height: 3rem;

	.MuiTabs-indicator {
		background-color: var(--feature-page-accent, ${palette.secondary.main});
		height: 3px;
	}
`;

export const SectionTabButton = styled(Tab)`
	border-radius: ${spacing.medium};
	color: ${palette.gray['06']};
	font-size: 0.9rem;
	font-weight: 700;
	letter-spacing: 0;
	min-height: 3rem;
	text-transform: none;

	&.Mui-selected {
		background: var(
			--feature-page-accent-soft,
			${hexToRgba(palette.secondary.main, 0.12)}
		);
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		color: ${palette.text.primary};
	}
`;
