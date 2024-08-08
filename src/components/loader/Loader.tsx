import { Ball, LoaderWrapper } from './Loader.styles';

type RepeatType = 'reverse' | 'loop' | 'mirror';

interface LoaderAnimation {
	animate: {
		x: string[];
	};
	transition: {
		duration: number;
		ease: string;
		repeat: number;
		repeatType: RepeatType;
	};
}

export const Loader = () => {
	const loaderAnimation: LoaderAnimation = {
		animate: {
			x: ['0rem', '1.875rem'],
		},
		transition: {
			duration: 1,
			ease: 'easeInOut',
			repeat: Infinity,
			repeatType: 'reverse',
		},
	};

	const reverseLoaderAnimation: LoaderAnimation = {
		animate: {
			x: ['0rem', '-1.875rem'],
		},
		transition: {
			duration: 1,
			ease: 'easeInOut',
			repeat: Infinity,
			repeatType: 'reverse',
		},
	};

	return (
		<LoaderWrapper>
			<Ball {...loaderAnimation} />
			<Ball {...reverseLoaderAnimation} />
		</LoaderWrapper>
	);
};
