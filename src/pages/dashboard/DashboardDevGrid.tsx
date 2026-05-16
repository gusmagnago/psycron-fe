import { useState } from 'react';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import {
	isBiggerThanMediumMedia,
	isBiggerThanTabletMedia,
} from '@psycron/theme/media-queries/mediaQueries';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

const CELLS = Array.from({ length: 120 });

const ToggleButton = styled('button')<{ active: boolean }>`
	all: unset;
	cursor: pointer;
	font-size: 10px;
	font-weight: 700;
	font-family: monospace;
	letter-spacing: 0.05em;
	padding: 4px 10px;
	border-radius: 4px;
	position: fixed;
	bottom: 20px;
	right: 20px;
	z-index: 10000;
	user-select: none;
	transition: opacity 0.15s ease;
	background: ${({ active }) =>
		active ? 'rgba(99, 102, 241, 0.9)' : 'rgba(99, 102, 241, 0.12)'};
	color: ${({ active }) => (active ? '#fff' : 'rgba(99, 102, 241, 0.9)')};
	border: 1px dashed rgba(99, 102, 241, 0.6);
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

	&:hover {
		opacity: 0.85;
	}
`;

const OverlayGrid = styled(Box)`
	position: absolute;
	inset: 0;
	pointer-events: none;
	z-index: 9999;
	display: grid;
	grid-template-columns: 1fr;
	grid-auto-rows: auto;
	gap: ${spacing.small};
	padding: ${spacing.xs};
	padding-top: 0;

	${isBiggerThanTabletMedia} {
		grid-template-columns: repeat(6, 1fr);
		grid-auto-rows: 140px;
		gap: ${spacing.mediumSmall};
	}

	${isBiggerThanMediumMedia} {
		grid-template-columns: repeat(12, 1fr);
		grid-auto-rows: 160px;
	}
`;

const GridCell = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'colIndex',
})<{ colIndex: number }>`
	outline: 1px dashed rgba(99, 102, 241, 0.4);
	background: ${({ colIndex }) =>
		colIndex % 2 === 0
			? 'rgba(99, 102, 241, 0.06)'
			: 'rgba(99, 102, 241, 0.02)'};
	border-radius: 6px;
	position: relative;
`;

const ColLabel = styled('span')`
	position: absolute;
	top: 4px;
	left: 5px;
	font-size: 9px;
	font-weight: 700;
	font-family: monospace;
	color: rgba(99, 102, 241, 0.5);
`;

export const DashboardDevGrid = () => {
	const [visible, setVisible] = useState(false);

	if (!import.meta.env.DEV) return null;

	return (
		<>
			<ToggleButton active={visible} onClick={() => setVisible((v) => !v)}>
				{visible ? '◉ GRID ON' : '◎ GRID'}
			</ToggleButton>

			{visible && (
				<OverlayGrid aria-hidden='true'>
					{CELLS.map((_, i) => {
						const colIndex = i % 12;
						return (
							<GridCell colIndex={colIndex} key={i}>
								<ColLabel>{colIndex + 1}</ColLabel>
							</GridCell>
						);
					})}
				</OverlayGrid>
			)}
		</>
	);
};
