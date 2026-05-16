import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { BentoTileEditControls } from './components/bento-tile-edit-controls/BentoTileEditControls';
import { BentoTileExpandedModal } from './components/bento-tile-expanded-modal/BentoTileExpandedModal';
import { BentoTileFooterChrome } from './components/bento-tile-footer-chrome/BentoTileFooterChrome';
import { BentoTileHeaderChrome } from './components/bento-tile-header-chrome/BentoTileHeaderChrome';
import {
	BentoTileChromeContext,
	type BentoTileChromeState,
} from './BentoTile.context';
import { bentoTileVariants } from './BentoTile.motion';
import {
	BentoTileBody,
	BentoTileEditFloat,
	BentoTileInner,
	BentoTileMotionBox,
	BentoTileRoot,
	DropTargetOverlay,
} from './BentoTile.styles';
import type { BentoTileProps } from './BentoTile.types';

export const BentoTile = ({
	ariaLabel,
	children,
	colSpan,
	id,
	index = 0,
	isEditMode,
	isHidden,
	onResize,
	onToggleVisibility,
	rowSpan,
	style,
	variant = 'default',
}: BentoTileProps) => {
	const { t } = useTranslation();
	const [chrome, setChrome] = useState<BentoTileChromeState>({});
	const [isExpanded, setIsExpanded] = useState(false);
	const {
		attributes,
		isDragging,
		listeners,
		setNodeRef,
		transform,
		transition,
	} = useSortable({ id, disabled: !isEditMode });

	const { actions, expandedContent, footer, headerActions, icon, title } =
		chrome;

	const sortableStyle = useMemo(
		() => ({
			...style,
			opacity: isDragging ? 0 : undefined,
			transform: CSS.Transform.toString(transform),
			transition,
			zIndex: isDragging ? 1 : undefined,
		}),
		[isDragging, style, transform, transition]
	);

	const sortableProps = isEditMode
		? { ...attributes, ...listeners }
		: undefined;
	const chromeContext = useMemo(() => ({ setChrome }), []);
	const hasFooterChrome = Boolean(footer || actions || expandedContent);
	const hasHeaderChrome = Boolean(title || icon || headerActions);
	const editControlLabels = useMemo(
		() => ({
			drag: t('page.dashboard.tile.drag'),
			dragAria: t('page.dashboard.tile.drag-aria'),
			hide: t('page.dashboard.tile.hide'),
			resizeDown: t('page.dashboard.tile.resize-down'),
			resizeDownAria: t('page.dashboard.tile.resize-down-aria'),
			resizeUp: t('page.dashboard.tile.resize-up'),
			resizeUpAria: t('page.dashboard.tile.resize-up-aria'),
			show: t('page.dashboard.tile.show'),
		}),
		[t]
	);
	const readMoreLabel = t('page.dashboard.tile.read-more');
	const closeLabel = t('page.dashboard.tile.close');

	const handleExpand = useCallback(() => setIsExpanded(true), []);
	const handleClose = useCallback(() => setIsExpanded(false), []);
	const handleResizeDown = useCallback(() => {
		onResize?.(id, -1);
	}, [id, onResize]);
	const handleResizeUp = useCallback(() => {
		onResize?.(id, 1);
	}, [id, onResize]);
	const handleHideToggle = useCallback(() => {
		onToggleVisibility?.(id);
	}, [id, onToggleVisibility]);

	return (
		<BentoTileRoot
			colSpan={colSpan}
			isEditMode={isEditMode}
			isHidden={isHidden}
			ref={setNodeRef}
			rowSpan={rowSpan}
			style={sortableStyle}
			{...sortableProps}
		>
			<BentoTileMotionBox
				aria-label={ariaLabel}
				custom={index}
				initial='hidden'
				isEditMode={isEditMode}
				role='region'
				variant={variant}
				variants={bentoTileVariants}
				whileInView='visible'
			>
				{isDragging && <DropTargetOverlay />}
				{isEditMode && (
					<BentoTileEditControls
						isHidden={isHidden}
						labels={editControlLabels}
						onHideToggle={handleHideToggle}
						onResizeDown={onResize ? handleResizeDown : undefined}
						onResizeUp={onResize ? handleResizeUp : undefined}
					/>
				)}
				<BentoTileEditFloat
					animate={isEditMode ? { y: [-2, 2, -2] } : { y: 0 }}
					transition={
						isEditMode
							? {
									delay: (index % 5) * 0.22,
									duration: 1.8 + (index % 3) * 0.35,
									ease: 'easeInOut',
									repeat: Infinity,
									repeatType: 'loop',
								}
							: { duration: 0.3, ease: 'easeOut' }
					}
				>
					<BentoTileChromeContext.Provider value={chromeContext}>
						<BentoTileInner
							hasFooterChrome={hasFooterChrome}
							hasHeaderChrome={hasHeaderChrome}
						>
							<BentoTileHeaderChrome
								headerActions={headerActions}
								icon={icon}
								title={title}
							/>
							<BentoTileBody>{children}</BentoTileBody>
							<BentoTileFooterChrome
								actions={actions}
								expandedContent={expandedContent}
								footer={footer}
								onExpand={handleExpand}
								readMoreLabel={readMoreLabel}
							/>
						</BentoTileInner>
					</BentoTileChromeContext.Provider>
				</BentoTileEditFloat>
				<BentoTileExpandedModal
					closeLabel={closeLabel}
					expandedContent={expandedContent}
					footer={footer}
					icon={icon}
					onClose={handleClose}
					open={isExpanded && Boolean(expandedContent)}
					title={title}
				/>
			</BentoTileMotionBox>
		</BentoTileRoot>
	);
};
