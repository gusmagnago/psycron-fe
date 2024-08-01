import { Canvas } from '@react-three/fiber';

import { Cylinder } from './components/Cylinder';
import { Lights } from './components/Lights';
import type { ICircularProgressProps } from './CircularProgress.types';

export const CircularProgress = ({ progress }: ICircularProgressProps) => {
	return (
		<Canvas
			style={{
				width: '300px',
				height: '300px',
				position: 'absolute',
			}}
		>
			<Lights />
			<ambientLight intensity={0.5} />
			<Cylinder progress={progress} />
		</Canvas>
	);
};
