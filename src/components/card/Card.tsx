import { Box, CardContent, Divider } from '@mui/material';

import { CardActions } from './CardActions/CardActions';
import { CardTitle } from './CardTitle/CardTitle';
import { CardWrapper } from './Card.styles';
import type { CardProps } from './Card.types';

export const Card = ({
	children,
	cardTitle,
	cardTitleProps,
	cardActionsProps,
}: CardProps) => {
	return (
		<CardWrapper>
			<CardContent>
				{cardTitle ? (
					<>
						<CardTitle {...cardTitleProps} />
						<Divider />
					</>
				) : null}
				<Box>{children}</Box>
				<CardActions {...cardActionsProps} />
			</CardContent>
		</CardWrapper>
	);
};
