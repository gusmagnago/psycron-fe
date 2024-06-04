import { Box, Button } from '@mui/material';

import type { CardActionsProps } from './CardActions.types';

export const CardActions = ({
	actionName,
	onClick,
	secondAction,
	secondActionName,
	tertiaryAction,
	tertiaryActionName,
	hasTertiary,
}: CardActionsProps) => {
	return (
		<Box
			width='100%'
			display='flex'
			flexDirection='column'
			justifyContent='flex-end'
		>
			<Box
				display='flex'
				flexDirection='row'
				justifyContent='flex-end'
				marginBottom={2}
			>
				<Button color='secondary' onClick={onClick} variant='contained'>
					{actionName}
				</Button>
				{secondAction ? (
					<Button color='primary' onClick={secondAction} variant='outlined'>
						{secondActionName}
					</Button>
				) : null}
			</Box>
			{hasTertiary ? (
				<Box display='flex' flexDirection='row' justifyContent='flex-end'>
					<Button color='tertiary' onClick={tertiaryAction} variant='contained'>
						{tertiaryActionName}
					</Button>
				</Box>
			) : null}
		</Box>
	);
};
