import { Button, Grid, Typography } from '@mui/material';
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
			<Grid
				container
				columns={12}
				justifyContent="space-between"
				alignItems='center'
			>
				<TitleWrapper>
					<Typography variant='h5'>{title}</Typography>
					{subheader?.length ? (
						<Typography variant='subtitle1' color={palette.text.secondary}>
							{subheader}
						</Typography>
					) : null}
				</TitleWrapper>
				{hasFirstChip ? (
					<Grid container xs={4} columnSpacing={2} justifyContent="flex-end" >
						<Grid item>
							<Button
								color='primary'
								onClick={firstChip}
								size='small'
								variant='contained'
							>
								{firstChipName}
							</Button>
						</Grid>
						<Grid item>
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
						</Grid>
					</Grid>
				) : null}
			</Grid>
		</CardTitleWrapper>
	);
};
