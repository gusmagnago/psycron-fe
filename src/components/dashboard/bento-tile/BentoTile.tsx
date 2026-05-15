import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { BentoTileEditControls } from './components/BentoTileEditControls';
import { BentoTileExpandedModal } from './components/BentoTileExpandedModal';
import { BentoTileFooterChrome } from './components/BentoTileFooterChrome';
import { BentoTileHeaderChrome } from './components/BentoTileHeaderChrome';
import {
	BentoTileChromeContext,
	type BentoTileChromeState,
} from './BentoTile.context';
import { bentoTileVariants } from './BentoTile.motion';
import {
	BentoTileBody,
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
