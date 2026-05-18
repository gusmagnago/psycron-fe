import {
	Maximize,
	Minus,
	NotVisible,
	Plus,
	Visible,
} from '@psycron/components/icons';
import { Tooltip } from '@psycron/components/tooltip/Tooltip';
import { ChevronsLeftRight, ChevronsRightLeft, GripVertical } from 'lucide-react';

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
	onOrientationToggle,
	onHideToggle,
	onResizeDown,
	onResizeNarrow,
	onResizeUp,
	onResizeWide,
	orientation,
}: BentoTileEditControlsProps) => {
	const visibilityLabel = isHidden ? labels.show : labels.hide;
	const layoutLabel =
		orientation === 'column' ? labels.layoutRow : labels.layoutColumn;
	const layoutAriaLabel =
		orientation === 'column' ? labels.layoutRowAria : labels.layoutColumnAria;

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
			{onResizeNarrow && onResizeWide && (
				<ResizeControls>
					<Tooltip
						aria-label={labels.resizeNarrowAria}
						onClick={onResizeNarrow}
						placement='bottom'
						title={labels.resizeNarrow}
					>
						<TileControlIconWrap>
							<ChevronsRightLeft />
						</TileControlIconWrap>
					</Tooltip>
					<Tooltip
						aria-label={labels.resizeWideAria}
						onClick={onResizeWide}
						placement='bottom'
						title={labels.resizeWide}
					>
						<TileControlIconWrap>
							<ChevronsLeftRight />
						</TileControlIconWrap>
					</Tooltip>
				</ResizeControls>
			)}
			{onOrientationToggle && orientation && (
				<Tooltip
					aria-label={layoutAriaLabel}
					onClick={onOrientationToggle}
					placement='bottom'
					title={layoutLabel}
				>
					<TileControlIconWrap>
						<Maximize />
					</TileControlIconWrap>
				</Tooltip>
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
