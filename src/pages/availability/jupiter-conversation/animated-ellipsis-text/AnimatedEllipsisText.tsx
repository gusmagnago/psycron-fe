import { Fragment } from 'react';

import { AnimatedEllipsis } from './AnimatedEllipsisText.styles';

interface AnimatedEllipsisTextProps {
	text: string;
}

const ELLIPSIS_PATTERN = /(\.\.\.|…)/g;

export const AnimatedEllipsisText = ({ text }: AnimatedEllipsisTextProps) => {
	const parts = text.split(ELLIPSIS_PATTERN);

	return (
		<>
			{parts.map((part, index) =>
				part === '...' || part === '…' ? (
					<AnimatedEllipsis aria-label='...' key={`${part}-${index}`}>
						<span aria-hidden='true'>.</span>
						<span aria-hidden='true'>.</span>
						<span aria-hidden='true'>.</span>
					</AnimatedEllipsis>
				) : (
					<Fragment key={`${part}-${index}`}>{part}</Fragment>
				)
			)}
		</>
	);
};
