import { Box, Button, Grid } from '@mui/material';

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
					<Button color='secondary' onClick={onClick} variant='contained'>
						{actionName}
					</Button>
				</Grid>
				{hasSecondAction ? (
					<Grid item>
						<Button color='primary' onClick={secondAction} variant='outlined'>
							{secondActionName}
						</Button>
					</Grid>
				) : null}
			</Grid>
			{hasTertiary ? (
				<Grid item>
					<Box display='flex' flexDirection='row' justifyContent='flex-end'>
						<Button
							color='tertiary'
							onClick={tertiaryAction}
							variant='contained'
						>
							{tertiaryActionName}
						</Button>
					</Box>
				</Grid>
			) : null}
		</Grid>
	);
};
