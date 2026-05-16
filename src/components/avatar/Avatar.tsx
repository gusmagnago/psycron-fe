import { Avatar as MUIAvatar } from '@mui/material';

import type { IAvatarProps } from './Avatar.types';

export const Avatar = ({
	large,
	firstName,
	lastName,
	size,
	src,
	...props
}: IAvatarProps) => {
	const largeSize = size ?? (large ? 100 : 70);

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
		const parts = name.trim().split(/\s+/);
		const initials = [parts[0]?.[0], parts[1]?.[0]]
			.filter(Boolean)
			.join('')
			.toUpperCase();
		return {
			sx: {
				bgcolor: name.trim() ? stringToColor(name) : undefined,
				width: largeSize,
				height: largeSize,
			},
			children: initials || undefined,
		};
	};

	return (
		<MUIAvatar
			alt={`user-${firstName}-avatar`}
			src={src || undefined}
			{...stringAvatar(`${firstName ?? ''} ${lastName ?? ''}`)}
			{...props}
		/>
	);
};
