import { Grid } from '@mui/material';
import { Button } from '@psycron/components/button/Button';
import { Text } from '@psycron/components/text/Text';
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
					<Text variant='h5' isFirstUpper>{title}</Text>
					{subheader?.length ? (
						<Text variant='subtitle1' color={palette.text.secondary} isFirstUpper>
							{subheader}
						</Text>
					) : null}
				</TitleWrapper>
				{hasFirstChip ? (
					<Grid container xs={4} columnSpacing={2} justifyContent="flex-end" >
						<Grid item>
							<Button
								onClick={firstChip}
								small
							>
								{firstChipName}
							</Button>
						</Grid>
						<Grid item>
							{hasSecondChip ? (
								<Button
									onClick={secondChip}
									small
									secondary
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
