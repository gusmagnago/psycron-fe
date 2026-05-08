import { Eye, EyeOff } from 'lucide-react';

import {
	BentoTileControls,
	BentoTileInner,
	BentoTileMotionBox,
	BentoTileRoot,
	DragHandle,
	VisibilityButton,
} from './BentoTile.styles';
import type { BentoTileProps } from './BentoTile.types';

const tileVariants = {
	hidden: { opacity: 0, y: 16 },
	visible: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' },
	}),
};

export const BentoTile = ({
	ariaLabel,
	children,
	colSpan,
	id,
	index = 0,
	isDragging,
	isEditMode,
	isHidden,
	onDragEnd,
	onDragOver,
	onDragStart,
	onToggleVisibility,
	rowSpan,
	style,
	variant = 'default',
}: BentoTileProps) => {
	const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
		e.dataTransfer.effectAllowed = 'move';
		onDragStart?.(id);
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
		onDragOver?.(id);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		onDragEnd?.();
	};

	return (
		<BentoTileRoot
			colSpan={colSpan}
			draggable={isEditMode}
			isDragging={isDragging}
			isHidden={isHidden}
			onDragEnd={handleDrop}
			onDragOver={handleDragOver}
			onDragStart={handleDragStart}
			rowSpan={rowSpan}
			style={style}
		>
			<BentoTileMotionBox
				aria-label={ariaLabel}
				custom={index}
				initial='hidden'
				isEditMode={isEditMode}
				role='region'
				variant={variant}
				variants={tileVariants}
				whileInView='visible'
			>
				{isEditMode && (
					<BentoTileControls>
						<DragHandle aria-hidden='true' title='Drag to reorder'>
							⠿
						</DragHandle>
						<VisibilityButton
							aria-label={isHidden ? 'Show tile' : 'Hide tile'}
							onClick={() => onToggleVisibility?.(id)}
							role='button'
							tabIndex={0}
						>
							{isHidden ? <Eye size={16} /> : <EyeOff size={16} />}
						</VisibilityButton>
					</BentoTileControls>
				)}
				<BentoTileInner>{children}</BentoTileInner>
			</BentoTileMotionBox>
		</BentoTileRoot>
	);
};
