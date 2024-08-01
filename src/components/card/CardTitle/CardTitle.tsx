/* eslint-disable indent */
import type { ReactElement } from 'react';
import React from 'react';
import { Box, Grid } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { Text } from '@psycron/components/text/Text';
import { Tooltip } from '@psycron/components/tooltip/Tooltip';
import { palette } from '@psycron/theme/palette/palette.theme';

import { CardTitleWrapper, TitleWrapper } from './CardTitle.styles';
import type { CardTitleProps } from './CardTitle.types';

export const CardTitle = ({
	title,
	subheader,
	firstChip,
	firstChipName,
	hasFirstChip,
	hasSecondChip,
	secondChip,
	secondChipName,
	firstChipTooltip,
}: CardTitleProps) => {
	return (
		<CardTitleWrapper>
			<Grid
				container
				columns={12}
				justifyContent='space-between'
				alignItems='center'
			>
				<Grid item xs={8}>
					<TitleWrapper>
						<Text variant='h5' isFirstUpper>
							{title}
						</Text>
						{subheader?.length ? (
							<Text
								variant='subtitle1'
								color={palette.text.secondary}
								isFirstUpper
							>
								{subheader}
							</Text>
						) : null}
					</TitleWrapper>
				</Grid>
				{hasFirstChip ? (
					<Grid item xs={4} display='flex' justifyContent='flex-end'>
						{firstChipName ? (
							typeof firstChipName === 'string' ||
							typeof firstChipName === 'number' ? (
								<Box>
									<Button onClick={firstChip} small>
										{firstChipName}
									</Button>
								</Box>
							) : React.isValidElement(firstChipName) ? ( // Check if firstChipName is a valid ReactElement
								<Tooltip title={firstChipTooltip}>
									{firstChipName as ReactElement}
								</Tooltip>
							) : null
						) : null}
						{hasSecondChip ? (
							<Box pl={2}>
								<Button onClick={secondChip} small secondary>
									{secondChipName}
								</Button>
							</Box>
						) : null}
					</Grid>
				) : null}
			</Grid>
		</CardTitleWrapper>
	);
};
