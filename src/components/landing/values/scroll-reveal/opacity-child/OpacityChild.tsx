import type { MotionValue} from 'framer-motion';
import { motion, useTransform } from 'framer-motion';

import { StyledText } from './OpacityChild.styles';

export interface IOpacityChildProps {
  children: React.ReactNode;
  index: number;
  progress: MotionValue<number>;
  total: number;
}

export const OpacityChild = ({
	children,
	index,
	progress,
	total,
}: IOpacityChildProps) => {
	const opacity = useTransform(
		progress,
		[index / total, (index + 1) / total],
		[0.5, 1]
	);

	return (
		<motion.span style={{ opacity }}>
			<StyledText variant='h5'>{children}</StyledText>
		</motion.span>
	);
};
