import { Button, Typography } from '@mui/material';
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
}: CardTitleProps) => {
	return (
		<CardTitleWrapper>
			<TitleWrapper>
				<Typography variant='h5'>{title}</Typography>
				{subheader ? (
					<Typography variant='subtitle1' color={palette.text.secondary}>
						{subheader}
					</Typography>
				) : null}
			</TitleWrapper>
			{hasFirstChip ? (
				<div>
					<Button
						color='primary'
						onClick={firstChip}
						size='small'
						variant='contained'
					>
						{firstChipName}
					</Button>
					{hasSecondChip ? (
						<Button
							color='secondary'
							onClick={secondChip}
							size='small'
							variant='outlined'
						>
							{secondChipName}
						</Button>
					) : null}
				</div>
			) : null}
		</CardTitleWrapper>
	);
};
