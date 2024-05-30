import { Box, CardContent, Divider } from '@mui/material';

import { CardActions } from './card-actions/CardActions';
import { CardTitle } from './card-title/CardTitle';
import { CardWrapper } from './Card.styles';
import type { CardProps } from './Card.types';

export const Card = ({
	content,
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
				<Box>{content}</Box>
				<CardActions {...cardActionsProps} />
			</CardContent>
		</CardWrapper>
	);
};
