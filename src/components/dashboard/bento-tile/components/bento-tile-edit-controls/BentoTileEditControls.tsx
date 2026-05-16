import { Minus, NotVisible, Plus, Visible } from '@psycron/components/icons';
import { Tooltip } from '@psycron/components/tooltip/Tooltip';
import { GripVertical } from 'lucide-react';

import { TileControlIconWrap } from '../../BentoTile.styles';

import {
	BentoTileControls,
	DragHandle,
	ResizeControls,
} from './BentoTileEditControls.styles';
import type { BentoTileEditControlsProps } from './BentoTileEditControls.types';

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
			<Tooltip
				aria-label={labels.dragAria}
				placement='bottom'
				title={labels.drag}
			>
				<DragHandle>
					<GripVertical />
				</DragHandle>
			</Tooltip>
			{onResizeDown && onResizeUp && (
				<ResizeControls>
					<Tooltip
						aria-label={labels.resizeDownAria}
						onClick={onResizeDown}
						placement='bottom'
						title={labels.resizeDown}
					>
						<TileControlIconWrap>
							<Minus />
						</TileControlIconWrap>
					</Tooltip>
					<Tooltip
						aria-label={labels.resizeUpAria}
						onClick={onResizeUp}
						placement='bottom'
						title={labels.resizeUp}
					>
						<TileControlIconWrap>
							<Plus />
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
					{isHidden ? <Visible /> : <NotVisible />}
				</TileControlIconWrap>
			</Tooltip>
		</BentoTileControls>
	);
};
