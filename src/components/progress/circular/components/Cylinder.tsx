import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography } from '@mui/material';
import { Text } from '@psycron/components/text/Text';
import { palette } from '@psycron/theme/palette/palette.theme';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import type { ICircularProgressProps, IHovered } from '../CircularProgress.types';

export const Cylinder = ({ progress }: ICircularProgressProps) => {
	const { t } = useTranslation();

	const primaryMeshRef = useRef<THREE.Mesh | null>(null);
	const secondaryMeshRef = useRef<THREE.Mesh | null>(null);

	const [hovered, setHovered] = useState<IHovered>('primary');

	const [displayedProgress, setDisplayedProgress] = useState<number>(0);
	const [displayedSecondaryProgress, setDisplayedSecondaryProgress] =
    useState<number>(0);

	useEffect(() => {
		setDisplayedProgress(0);
		setDisplayedSecondaryProgress(0);
	}, [progress]);

	const initalZPosition = Math.PI / 2;

	const createTorusGeometry = useMemo(() => {
		const geometryCache = new Map();

		return (progress: number) => {
			const angle = (progress / 100) * Math.PI * -2;
			if (!geometryCache.has(angle)) {
				geometryCache.set(
					angle,
					new THREE.TorusGeometry(1, 0.05, 32, 100, angle)
				);
			}
			return geometryCache.get(angle);
		};
	}, []);

	const updateMesh = useCallback(
		(mesh: THREE.Mesh | null, progress: number, rotationOffset: number) => {
			if (mesh) {
				const geometry = createTorusGeometry(progress);

				mesh.geometry.dispose();
				mesh.geometry = geometry;
				mesh.rotation.z = rotationOffset;
			}
		},
		[createTorusGeometry]
	);

	useFrame(() => {
		if (displayedProgress < progress[0]) {
			setDisplayedProgress((prev) => Math.min(prev + 1, progress[0]));
		}

		if (displayedSecondaryProgress < progress[1]) {
			setDisplayedSecondaryProgress((prev) => Math.min(prev + 1, progress[1]));
		}

		updateMesh(primaryMeshRef.current, displayedProgress, initalZPosition);
		updateMesh(
			secondaryMeshRef.current,
			displayedSecondaryProgress,
			initalZPosition + (progress[0] / 100) * Math.PI * -2
		);
	});

	const handleOnver = useCallback(
		(ref: IHovered) => {
			if (
				progress[0] > 0 &&
        progress[0] < 100 &&
        progress[1] > 0 &&
        progress[1] < 100
			) {
				setHovered(ref);
				document.body.style.cursor = 'pointer';
			}
		},
		[progress]
	);

	const handleOut = useCallback(() => {
		setHovered('primary');
		document.body.style.cursor = 'default';
	}, []);

	const displayProgressSubtitle = (ref: IHovered, progress: number[]) => {
		const progressValue = ref === 'primary' ? progress[0] : progress[1];
		const refDescriptionKey =
      ref === 'primary'
      	? t('components.progress.received', { progress: progress[0] })
      	: t('components.progress.missing', { progress: progress[1] });

		if (progressValue > 0 && progressValue < 100) {
			return t(refDescriptionKey, { progressValue });
		} else if (
			progressValue === 0 ||
      (progress[0] === 0 && progress[1] === 100)
		) {
			return t('components.progress.not-received');
		} else {
			return t('components.progress.received-all');
		}
	};

	return (
		<>
			<mesh
				scale={3.5}
				ref={primaryMeshRef}
				onPointerOver={() => handleOnver('primary')}
				onPointerOut={handleOut}
			>
				<meshPhysicalMaterial
					color={
						hovered !== 'primary'
							? palette.primary.main
							: palette.primary.action.hover
					}
					transmission={0.5}
					roughness={0.5}
				/>
			</mesh>
			<mesh
				scale={3.5}
				ref={secondaryMeshRef}
				onPointerOver={() => handleOnver('secondary')}
				onPointerOut={handleOut}
			>
				<meshPhysicalMaterial
					color={
						hovered !== 'secondary' ? palette.gray['02'] : palette.gray['03']
					}
					transmission={0.8}
					roughness={0.5}
				/>
			</mesh>
			{hovered && (
				<Html center>
					<Box width={150}>
						<Typography variant='h3' fontWeight={700}>
							{hovered === 'primary' ? progress[0] : progress[1]}%
						</Typography>
						<Text variant='caption' isFirstUpper>
							{displayProgressSubtitle(hovered, progress)}
						</Text>
					</Box>
				</Html>
			)}
		</>
	);
};
