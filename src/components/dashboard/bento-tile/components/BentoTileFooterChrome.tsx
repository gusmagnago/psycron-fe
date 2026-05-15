import { Maximize } from '@psycron/components/icons';
import { Tooltip } from '@psycron/components/tooltip/Tooltip';

import {
	BentoTileActionsSlot,
	BentoTileFooter,
	BentoTileFooterSlot,
	TileControlIconWrap,
} from '../BentoTile.styles';
import type { BentoTileFooterChromeProps } from '../BentoTile.types';

export const BentoTileFooterChrome = ({
	actions,
	expandedContent,
	footer,
	onExpand,
	readMoreLabel,
}: BentoTileFooterChromeProps) => {
	if (!footer && !actions && !expandedContent) return null;

	return (
		<BentoTileFooter>
			<BentoTileFooterSlot>{footer}</BentoTileFooterSlot>
			<BentoTileActionsSlot>
				{actions}
				{expandedContent && (
					<Tooltip
						aria-label={readMoreLabel}
						onClick={onExpand}
						placement='bottom'
						title={readMoreLabel}
					>
						<TileControlIconWrap>
							<Maximize height={14} width={14} />
						</TileControlIconWrap>
					</Tooltip>
				)}
			</BentoTileActionsSlot>
		</BentoTileFooter>
	);
};
