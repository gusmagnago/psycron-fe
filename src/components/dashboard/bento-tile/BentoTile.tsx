import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Eye, EyeOff } from 'lucide-react';

import {
	BentoTileControls,
	BentoTileInner,
	BentoTileMotionBox,
	BentoTileRoot,
	DragHandle,
	DropTargetOverlay,
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
	isEditMode,
	isHidden,
	onToggleVisibility,
	rowSpan,
	style,
	variant = 'default',
}: BentoTileProps) => {
	const {
		attributes,
		isDragging,
		listeners,
		setNodeRef,
		transform,
		transition,
	} = useSortable({ id, disabled: !isEditMode });

	const sortableStyle = {
		...style,
		transform: CSS.Transform.toString(transform),
		transition,
		zIndex: isDragging ? 1 : undefined,
		opacity: isDragging ? 0 : undefined,
	};

	return (
		<BentoTileRoot
			colSpan={colSpan}
			isEditMode={isEditMode}
			isHidden={isHidden}
			ref={setNodeRef}
			rowSpan={rowSpan}
			style={sortableStyle}
			{...(isEditMode ? { ...attributes, ...listeners } : {})}
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
				{isDragging && <DropTargetOverlay />}
				{isEditMode && (
					<BentoTileControls>
						<DragHandle aria-hidden='true' title='Drag to reorder'>
							⠿
						</DragHandle>
						<VisibilityButton
							aria-label={isHidden ? 'Show tile' : 'Hide tile'}
							onClick={(e) => {
								e.stopPropagation();
								onToggleVisibility?.(id);
							}}
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
