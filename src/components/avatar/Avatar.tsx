import { Avatar as MUIAvatar } from '@mui/material';
import useViewport from '@psycron/hooks/useViewport';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

import type { IAvatarProps } from './Avatar.types';

export const Avatar = ({
	large,
	firstName,
	lastName,
	src,
	...props
}: IAvatarProps) => {
	const { isMobile } = useViewport();

	const largeSize = large ? 60 : 45;

	const stringToColor = (string: string) => {
		let hash = 0;
		let i;

		for (i = 0; i < string.length; i += 1) {
			hash = string.charCodeAt(i) + ((hash << 5) - hash);
		}

		let color = '#';
		for (i = 0; i < 3; i += 1) {
			const value = (hash >> (i * 8)) & 0xff;
			color += `00${value.toString(16)}`.slice(-2);
		}

		return color;
	};

	const stringAvatar = (name: string) => {
		return {
			sx: {
				bgcolor: stringToColor(name),
				width: largeSize,
				height: largeSize,
				margin: !isMobile
					? `0 ${largeSize ? spacing.small : spacing.space}`
					: `0 ${largeSize ? spacing.space : spacing.xs}`,
			},
			children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
		};
	};

	return (
		<MUIAvatar
			alt={`user-${firstName}-avatar`}
			src={src ? src : ''}
			{...stringAvatar(`${firstName} ${lastName}`)}
			{...props}
		/>
	);
};
