import {
	BentoTileHeader,
	BentoTileHeaderActions,
	BentoTileHeaderIcon,
	BentoTileHeaderIdentity,
	BentoTileHeaderTitle,
} from '../BentoTile.styles';
import type { BentoTileHeaderChromeProps } from '../BentoTile.types';

export const BentoTileHeaderChrome = ({
	headerActions,
	icon,
	title,
}: BentoTileHeaderChromeProps) => {
	if (!title && !icon && !headerActions) return null;

	return (
		<BentoTileHeader>
			<BentoTileHeaderIdentity>
				{icon && <BentoTileHeaderIcon>{icon}</BentoTileHeaderIcon>}
				{title && <BentoTileHeaderTitle>{title}</BentoTileHeaderTitle>}
			</BentoTileHeaderIdentity>
			{headerActions && (
				<BentoTileHeaderActions>{headerActions}</BentoTileHeaderActions>
			)}
		</BentoTileHeader>
	);
};
