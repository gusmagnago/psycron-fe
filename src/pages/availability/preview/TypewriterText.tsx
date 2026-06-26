import { useEffect, useState } from 'react';

interface TypewriterTextProps {
	// Milliseconds per character.
	speed?: number;
	text: string;
}

const prefersReducedMotion = (): boolean =>
	typeof window !== 'undefined' &&
	window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Reveals text one character at a time, mirroring the prototype's typeBubble
// behaviour. Skips straight to the full string when reduced motion is set.
export const TypewriterText = ({ speed = 24, text }: TypewriterTextProps) => {
	const [count, setCount] = useState(() =>
		prefersReducedMotion() ? text.length : 0
	);

	useEffect(() => {
		if (prefersReducedMotion()) {
			setCount(text.length);
			return;
		}

		setCount(0);
		const interval = setInterval(() => {
			setCount((prev) => {
				if (prev >= text.length) {
					clearInterval(interval);
					return prev;
				}
				return prev + 1;
			});
		}, speed);

		return () => clearInterval(interval);
	}, [speed, text]);

	return <>{text.slice(0, count)}</>;
};
