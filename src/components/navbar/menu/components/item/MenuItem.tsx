import { useState } from 'react';
import { Text } from '@psycron/components/text/Text';
import { useCanHover } from '@psycron/hooks/userCanHover';

import {
	MenuBadge,
	MenuIconWrap,
	MobileMenuIconWrapper,
	MobileMenuItem,
	StyledMenuItem,
} from './MenuItem.styles';
import type { IMenuItem } from './MenuItem.types';

export const MenuItem = ({
	badgeCount,
	icon,
	name,
	isFooterIcon,
	isFullList,
	disabled,
	hoverIcon,
}: IMenuItem) => {
	const canHover = useCanHover();
	const [isHovered, setIsHovered] = useState(false);

	const shouldSwap = !isFullList && canHover && Boolean(hoverIcon);

	const renderedIcon = shouldSwap && isHovered && hoverIcon ? hoverIcon : icon;

	return (
		<>
			{isFullList ? (
				<MobileMenuItem disabled={disabled}>
					<MobileMenuIconWrapper>{icon}</MobileMenuIconWrapper>
					<Text textTransform='capitalize'>{name}</Text>
				</MobileMenuItem>
			) : (
				<StyledMenuItem
					title={name}
					placement='right'
					disabled={disabled}
					$disabled={disabled}
					$isFooterIcon={isFooterIcon}
				>
					<MenuIconWrap
						onMouseEnter={() => {
							if (shouldSwap) setIsHovered(true);
						}}
						onMouseLeave={() => {
							if (shouldSwap) setIsHovered(false);
						}}
						onFocus={() => {
							if (shouldSwap) setIsHovered(true);
						}}
						onBlur={() => {
							if (shouldSwap) setIsHovered(false);
						}}
					>
						{renderedIcon}
						{badgeCount ? (
							<MenuBadge>{badgeCount > 99 ? '99+' : badgeCount}</MenuBadge>
						) : null}
					</MenuIconWrap>
				</StyledMenuItem>
			)}
		</>
	);
};
