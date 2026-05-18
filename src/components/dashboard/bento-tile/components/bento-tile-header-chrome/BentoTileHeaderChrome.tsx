import {
	BentoTileHeaderIcon,
	BentoTileHeaderIdentity,
	BentoTileHeaderTitle,
} from '../../BentoTile.styles';

import {
	BentoTileHeader,
	BentoTileHeaderActions,
} from './BentoTileHeaderChrome.styles';
import type { BentoTileHeaderChromeProps } from './BentoTileHeaderChrome.types';

export const BentoTileHeaderChrome = ({
	headerActions,
	icon,
	infoButton,
	title,
}: BentoTileHeaderChromeProps) => {
	if (!title && !icon && !headerActions && !infoButton) return null;

	return (
		<BentoTileHeader>
			<BentoTileHeaderIdentity>
				{icon && <BentoTileHeaderIcon>{icon}</BentoTileHeaderIcon>}
				{title && <BentoTileHeaderTitle>{title}</BentoTileHeaderTitle>}
			</BentoTileHeaderIdentity>
			<BentoTileHeaderActions>
				{headerActions}
				{infoButton}
			</BentoTileHeaderActions>
		</BentoTileHeader>
	);
};
