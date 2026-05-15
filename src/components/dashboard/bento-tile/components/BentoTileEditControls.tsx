import { Minus, NotVisible, Plus, Visible } from '@psycron/components/icons';
import { Tooltip } from '@psycron/components/tooltip/Tooltip';

import {
	BentoTileControls,
	DragHandle,
	ResizeControls,
	TileControlIconWrap,
} from '../BentoTile.styles';
import type { BentoTileEditControlsProps } from '../BentoTile.types';

export const BentoTileEditControls = ({
	isHidden,
	labels,
	onHideToggle,
	onResizeDown,
	onResizeUp,
}: BentoTileEditControlsProps) => {
	const visibilityLabel = isHidden ? labels.show : labels.hide;

	return (
		<BentoTileControls onPointerDown={(e) => e.stopPropagation()}>
			<DragHandle aria-hidden='true' title='Drag to reorder'>
				⠿
			</DragHandle>
			{onResizeDown && onResizeUp && (
				<ResizeControls>
					<Tooltip
						aria-label={labels.resizeDownAria}
						onClick={onResizeDown}
						placement='bottom'
						title={labels.resizeDown}
					>
						<TileControlIconWrap>
							<Minus height={14} width={14} />
						</TileControlIconWrap>
					</Tooltip>
					<Tooltip
						aria-label={labels.resizeUpAria}
						onClick={onResizeUp}
						placement='bottom'
						title={labels.resizeUp}
					>
						<TileControlIconWrap>
							<Plus height={14} width={14} />
						</TileControlIconWrap>
					</Tooltip>
				</ResizeControls>
			)}
			<Tooltip
				aria-label={visibilityLabel}
				onClick={onHideToggle}
				placement='bottom'
				title={visibilityLabel}
			>
				<TileControlIconWrap>
					{isHidden ? (
						<Visible height={16} width={16} />
					) : (
						<NotVisible height={16} width={16} />
					)}
				</TileControlIconWrap>
			</Tooltip>
		</BentoTileControls>
	);
};
