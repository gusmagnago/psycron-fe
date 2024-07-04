import { useEffect, useRef, useState } from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { differenceInSeconds, parseISO } from 'date-fns';

import { StyledProgressWrapper } from './Progress.styles';
import type { IProgressProps } from './Progress.types';

export const Progress = ({
	showLabel,
	duration,
	appointmentStart,
	size,
	shouldProceed,
}: IProgressProps) => {
	const [progress, setProgress] = useState<number>(0);
	const intervalRef = useRef<number | null>(null);

	useEffect(() => {
		if (shouldProceed && duration && appointmentStart) {
			const appointmentStartTime = parseISO(appointmentStart);
			const now = new Date();
			const initialElapsedSeconds = differenceInSeconds(
				now,
				appointmentStartTime
			);

			setProgress((initialElapsedSeconds / (duration * 60)) * 100);
			const intervalTime = 1000;

			intervalRef.current = window.setInterval(() => {
				const elapsedSeconds = differenceInSeconds(
					new Date(),
					appointmentStartTime
				);
				setProgress((elapsedSeconds / (duration * 60)) * 100);
			}, intervalTime);

			return () => {
				if (intervalRef.current) {
					clearInterval(intervalRef.current);
				}
			};
		} else if (size) {
			const updateInterval = 800;
			intervalRef.current = window.setInterval(() => {
				setProgress((prevProgress) => {
					if (prevProgress >= 100) {
						clearInterval(intervalRef.current!);
						return prevProgress;
					}
					const nextProgress = prevProgress + Math.random() * 10;
					return Math.min(nextProgress, 100);
				});
			}, updateInterval);

			return () => {
				if (intervalRef.current) {
					clearInterval(intervalRef.current);
				}
			};
		}
	}, [duration, size, appointmentStart, shouldProceed]);

	const renderTime = (duration: number): string => {
		const elapsedSeconds = Math.round((progress / 100) * duration * 60);
		const remainingSeconds = Math.round(duration * 60 - elapsedSeconds);
		if (remainingSeconds <= 0) {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
			return '00:00';
		}

		const hours = Math.floor(remainingSeconds / 3600);
		const minutes = Math.floor((remainingSeconds % 3600) / 60);
		const seconds = remainingSeconds % 60;

		if (hours > 0) {
			return `${hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
		} else {
			return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
		}
	};

	return (
		<StyledProgressWrapper>
			<Box width='100%' mr={2}>
				<LinearProgress variant='determinate' value={progress} />
			</Box>
			{showLabel ? (
				<Box width={'auto'}>
					<Typography variant='caption' color='text.secondary'>
						{duration ? renderTime(duration) : `${progress.toFixed()} %`}
					</Typography>
				</Box>
			) : null}
		</StyledProgressWrapper>
	);
};
