import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
	comingSoon,
	icon,
	name,
	isActive,
	isFooterIcon,
	isFullList,
	disabled,
	hoverIcon,
}: IMenuItem) => {
	const canHover = useCanHover();
	const { t } = useTranslation();
	const [isHovered, setIsHovered] = useState(false);

	const shouldSwap = !isFullList && canHover && Boolean(hoverIcon);

	const renderedIcon = shouldSwap && isHovered && hoverIcon ? hoverIcon : icon;

	// A "coming soon" item stays visually disabled but keeps its tooltip so the
	// reason is surfaced instead of being a silent grey icon.
	const tooltipTitle = comingSoon
		? `${name} · ${t('globals.coming-soon-label')}`
		: name;

	return (
		<>
			{isFullList ? (
				<MobileMenuItem disabled={disabled} $active={isActive}>
					<MobileMenuIconWrapper>{icon}</MobileMenuIconWrapper>
					<Text textTransform='capitalize'>{tooltipTitle}</Text>
				</MobileMenuItem>
			) : (
				<StyledMenuItem
					title={tooltipTitle}
					placement='right'
					disabled={disabled && !comingSoon}
					plainHover
					$disabled={disabled}
					$isFooterIcon={isFooterIcon}
				>
					<MenuIconWrap
						$active={isActive}
						$disabled={disabled}
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
