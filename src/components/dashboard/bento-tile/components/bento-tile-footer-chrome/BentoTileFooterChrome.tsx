import { Maximize } from '@psycron/components/icons';
import { Tooltip } from '@psycron/components/tooltip/Tooltip';

import { TileControlIconWrap } from '../../BentoTile.styles';

import {
	BentoTileActionsSlot,
	BentoTileFooter,
	BentoTileFooterSlot,
} from './BentoTileFooterChrome.styles';
import type { BentoTileFooterChromeProps } from './BentoTileFooterChrome.types';

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
