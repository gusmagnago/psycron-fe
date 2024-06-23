import { Box, Grid } from '@mui/material';
import { Button } from '@psycron/components/button/Button';

import type { CardActionsProps } from './CardActions.types';

export const CardActions = ({
	actionName,
	onClick,
	secondAction,
	secondActionName,
	tertiaryAction,
	tertiaryActionName,
	hasTertiary,
	hasSecondAction,
}: CardActionsProps) => {
	return (
		<Grid container columns={12} justifyContent='flex-end'>
			<Grid
				container
				justifyContent='flex-end'
				marginBottom={2}
				columnSpacing={3}
			>
				<Grid item>
					<Button onClick={onClick}>{actionName}</Button>
				</Grid>
				{hasSecondAction ? (
					<Grid item>
						<Button onClick={secondAction} secondary>
							{secondActionName}
						</Button>
					</Grid>
				) : null}
			</Grid>
			{hasTertiary ? (
				<Grid item>
					<Box display='flex' flexDirection='row' justifyContent='flex-end'>
						<Button onClick={tertiaryAction} tertiary>{tertiaryActionName}</Button>
					</Box>
				</Grid>
			) : null}
		</Grid>
	);
};
