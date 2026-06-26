import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { isBiggerThanMediumMedia } from '@psycron/theme/media-queries/mediaQueries';
import { hexToRgba, palette } from '@psycron/theme/palette/palette.theme';
import { shadowMain } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

// Mirrors the prototype `.frame` → `.app-header` + `.chat` (`.stream`/`.reading`
// + `.dock`/`.dock-inner`) composition, assembled from the catalog atoms.

export const ExampleFrame = styled(Box)`
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: 760px;
	height: 620px;
	overflow: hidden;
	border-radius: ${spacing.mediumSmall};
	background: ${palette.background.default};
	box-shadow: ${shadowMain};
`;

export const ExampleHeader = styled(Box)`
	flex-shrink: 0;
	padding: 18px 22px 14px;
	background: ${palette.white};
`;

export const ExampleHeaderTitle = styled('h2')`
	margin: 0;
	font-size: 20px;
	font-weight: 800;
	color: ${palette.text.primary};
`;

export const ExampleHeaderSubtitle = styled('p')`
	margin: ${spacing.xxs} 0 0;
	font-size: 12.5px;
	color: ${palette.text.secondary};
`;

export const ExampleChat = styled(Box)`
	position: relative;
	display: flex;
	flex: 1;
	min-height: 0;
	flex-direction: column;
`;

export const ExampleStream = styled(Box)`
	display: flex;
	flex: 1;
	flex-direction: column;
	justify-content: flex-end;
	min-height: 0;
	width: 100%;
	margin: 0 auto;
	overflow-y: auto;
	padding: ${spacing.xs};
	scroll-behavior: smooth;

	${isBiggerThanMediumMedia} {
		width: 80%;
	}
`;

export const ExampleReading = styled(Box)`
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	gap: ${spacing.xs};
	width: 100%;
	height: 100%;
	margin: auto auto 0;
`;

export const ExampleGroup = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'sender',
})<{ sender: 'bot' | 'user' }>`
	display: flex;
	gap: 10px;
	align-items: flex-end;
	flex-direction: ${({ sender }) => (sender === 'user' ? 'row-reverse' : 'row')};
`;

export const ExampleStack = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'sender',
})<{ sender: 'bot' | 'user' }>`
	display: flex;
	flex-direction: column;
	gap: 3px;
	min-width: 0;
	align-items: ${({ sender }) =>
		sender === 'user' ? 'flex-end' : 'flex-start'};
`;

export const ExampleDock = styled(Box)`
	flex-shrink: 0;
	padding: ${spacing.xs} ${spacing.xs} ${spacing.small};
	background: linear-gradient(
		to top,
		${palette.background.default} 78%,
		${hexToRgba(palette.background.default, 0)}
	);
`;

export const ExampleDockInner = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	width: 100%;
	max-width: 560px;
	margin: 0 auto;
`;

export const ExampleChipsRow = styled(Box)`
	display: flex;
	flex-wrap: wrap;
	gap: ${spacing.xs};
`;

// ─── Inline box content (permissions / calendar picker) ──────────────────────

export const BoxTitle = styled('h4')`
	margin: 0;
	font-size: 14px;
	font-weight: 700;
	color: ${palette.text.primary};
`;

export const BoxMuted = styled('p')`
	margin: 0;
	font-size: 12px;
	color: ${palette.text.secondary};
	text-align: left;
`;

export const BoxList = styled('ul')`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	margin: 0;
	padding: 0;
	list-style: none;
`;

export const BoxButtonRow = styled(Box)`
	display: flex;
	justify-content: flex-end;
	gap: ${spacing.xs};
	margin-top: ${spacing.xxs};
`;

export const PreviewHead = styled(Box)`
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: ${spacing.xs};
`;

export const PreviewRows = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
`;

export const PublishGroup = styled(Box)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.xs};
	margin-top: ${spacing.xxs};
`;
