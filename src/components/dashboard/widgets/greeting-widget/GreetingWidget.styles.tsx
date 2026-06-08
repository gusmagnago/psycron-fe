import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { isBiggerThanTabletMedia } from '@psycron/theme/media-queries/mediaQueries';
import { palette } from '@psycron/theme/palette/palette.theme';
import { shadowSmall } from '@psycron/theme/shadow/shadow.theme';
import { spacing } from '@psycron/theme/spacing/spacing.theme';
import { motion } from 'framer-motion';

/* ── Root: stacks greeting head + Jupiter panel ──────────────────── */
export const GreetingWidgetRoot = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	gap: ${spacing.small};
	height: 100%;
	min-width: 0;
	padding-bottom: ${spacing.xs};
`;

export const WeatherMeta = styled.span`
	color: ${palette.text.secondary};
	font-size: 0.7rem;
	font-weight: 700;
	line-height: 1.2;
`;

/* ── Greeting head: icon | copy ──────────────────────────────────── */
export const GreetingHead = styled(Box)`
	align-items: center;
	display: flex;
	flex: none;
	max-height: fit-content;
	gap: 18px;
	min-width: 0;
	width: 100%;
	justify-content: flex-start;
`;

export const GreetingCopy = styled(motion.div)`
	display: flex;
	flex-direction: column;
	gap: ${spacing.space};
	min-width: 0;
	text-align: left;
`;

export const GreetingEyebrow = styled.span`
	color: ${palette.text.secondary};
	font-size: 0.8125rem;
	font-weight: 500;
	line-height: 1.2;
`;

export const GreetingHeadline = styled.h2`
	color: ${palette.text.primary};
	font-size: 1.625rem;
	font-weight: 800;
	line-height: 1.12;
	margin: 0;

	${isBiggerThanTabletMedia} {
		font-size: 2rem;
	}
`;

export const GreetingSubtext = styled.span`
	color: ${palette.text.secondary};
	display: block;
	font-size: 0.75rem;
	font-weight: 500;
	line-height: 1.4;
	margin-top: ${spacing.xxs};
`;

/* ── Jupiter embedded panel shell ───────────────────────────────── */
export const JupiterPanel = styled(Box)`
	background: ${palette.tertiary.light};
	border-radius: 16px;
	box-shadow: ${shadowSmall};
	display: flex;
	flex-direction: column;
	flex: 1;
	gap: ${spacing.xs};
	min-height: 0;
	overflow: hidden;
	padding: 12px 14px;
`;

export const JupiterIconBox = styled(motion.div)`
	align-items: center;
	background: ${palette.white};
	border-radius: 12px;
	box-shadow: ${shadowSmall};
	color: ${palette.brand.purple};
	display: flex;
	flex: none;
	height: 40px;
	justify-content: center;
	width: 40px;
`;

export const JupiterPanelHeader = styled(Box)`
	align-items: center;
	display: flex;
	gap: ${spacing.xs};
	justify-content: space-between;
`;

export const JupiterPanelIdentity = styled(Box)`
	align-items: center;
	display: flex;
	flex: 1;
	gap: ${spacing.xs};
	min-width: 0;
`;

export const JupiterPanelFooter = styled(Box)`
	align-items: flex-end;
	display: flex;
	justify-content: space-between;
`;
