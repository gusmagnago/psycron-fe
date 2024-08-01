import {
	AnimatedBackgroundWrapper,
	GradientBackground,
	GradientBlob,
} from './AnimatedBackground.styles';

export const AnimatedBackground = () => {
	const getRandomPosition = (max: number) =>
		Math.floor(Math.random() * max) - max / 2;

	const primaryAnimation = {
		animate: {
			x: [
				getRandomPosition(500),
				getRandomPosition(500),
				getRandomPosition(500),
			],
			y: [
				getRandomPosition(500),
				getRandomPosition(500),
				getRandomPosition(500),
			],
			scale: [1, 0.8, 1],
			rotate: [0, 180, 360],
			transition: {
				duration: 7,
				ease: [0.47, 0, 0.745, 0.715],
				repeat: Infinity,
			},
		},
	};

	const secondaryAnimation = {
		animate: {
			x: [
				getRandomPosition(500),
				getRandomPosition(500),
				getRandomPosition(500),
			],
			y: [
				getRandomPosition(500),
				getRandomPosition(500),
				getRandomPosition(500),
			],
			rotate: [0, -180, -360],
			transition: {
				duration: 7,
				ease: [0.47, 0, 0.745, 0.715],
				repeat: Infinity,
			},
		},
	};

	return (
		<AnimatedBackgroundWrapper>
			<GradientBackground>
				<GradientBlob
					gradient='primary'
					variants={primaryAnimation}
					animate='animate'
				/>
				<GradientBlob
					gradient='secondary'
					variants={secondaryAnimation}
					animate='animate'
				/>
			</GradientBackground>
		</AnimatedBackgroundWrapper>
	);
};
