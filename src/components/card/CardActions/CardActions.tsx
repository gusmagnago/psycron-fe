import { Grid } from '@mui/material';
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
	type,
	loading,
	disabled,
}: CardActionsProps) => {
	return (
		<Grid container columns={12} rowSpacing={3} display='flex'>
			<Grid
				container
				columns={12}
				marginBottom={hasTertiary ? 2 : 0}
				rowSpacing={3}
				columnSpacing={6}
				display='flex'
				width='100%'
			>
				{hasSecondAction ? (
					<Grid
						size={{ xs: 12, md: 6 }}
						display='flex'
						justifyContent='flex-start'
					>
						<Button onClick={secondAction} secondary fullWidth>
							{secondActionName}
						</Button>
					</Grid>
				) : null}
				<Grid
					size={{ xs: 12, md: hasSecondAction ? 6 : 12 }}
					display='flex'
					justifyContent='flex-end'
					flexDirection='column'
					rowGap={3}
				>
					<Button
						disabled={disabled}
						onClick={onClick}
						type={type}
						fullWidth
						loading={loading}
					>
						{actionName}
					</Button>
					{hasTertiary ? (
						<Button onClick={tertiaryAction} tertiary fullWidth>
							{tertiaryActionName}
						</Button>
					) : null}
				</Grid>
			</Grid>
		</Grid>
	);
};
