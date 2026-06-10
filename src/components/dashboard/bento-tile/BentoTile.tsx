import {
	type Dispatch,
	type SetStateAction,
	useCallback,
	useMemo,
	useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { COL_RESIZE_STEP } from '@psycron/pages/dashboard/Dashboard.utils';

import { BentoTileEditControls } from './components/bento-tile-edit-controls/BentoTileEditControls';
import { BentoTileExpandedModal } from './components/bento-tile-expanded-modal/BentoTileExpandedModal';
import { BentoTileFooterChrome } from './components/bento-tile-footer-chrome/BentoTileFooterChrome';
import { BentoTileHeaderChrome } from './components/bento-tile-header-chrome/BentoTileHeaderChrome';
import {
	BentoTileChromeContext,
	type BentoTileChromeState,
	isSameChrome,
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
	onToggleOrientation,
	onResize,
	onResizeWidth,
	onToggleVisibility,
	orientation,
	rowSpan,
	style,
	variant = 'default',
}: BentoTileProps) => {
	const { t } = useTranslation();
	const [chrome, setChromeState] = useState<BentoTileChromeState>({});

	// Shallow-compare before committing so identical chrome (the common case when
	// a tile re-renders for unrelated reasons) does not trigger a state update
	// and re-render (review FE #101, finding 10).
	const setChrome = useCallback<Dispatch<SetStateAction<BentoTileChromeState>>>(
		(value) => {
			setChromeState((prev) => {
				const next =
					typeof value === 'function'
						? (value as (p: BentoTileChromeState) => BentoTileChromeState)(prev)
						: value;

				return isSameChrome(prev, next) ? prev : next;
			});
		},
		[]
	);
	const [isExpanded, setIsExpanded] = useState(false);
	const {
		attributes,
		isDragging,
		listeners,
		setNodeRef,
		transform,
		transition,
	} = useSortable({ id, disabled: !isEditMode });

	const { actions, expandedContent, footer, headerActions, icon, title, titleId } =
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
	const chromeContext = useMemo(() => ({ setChrome }), [setChrome]);
	const hasFooterChrome = Boolean(footer || actions || expandedContent);
	const hasHeaderChrome = Boolean(title || icon || headerActions);
	const editControlLabels = useMemo(
		() => ({
			drag: t('page.dashboard.tile.drag'),
			dragAria: t('page.dashboard.tile.drag-aria'),
			hide: t('page.dashboard.tile.hide'),
			layoutColumn: t('page.dashboard.tile.layout-column'),
			layoutColumnAria: t('page.dashboard.tile.layout-column-aria'),
			layoutRow: t('page.dashboard.tile.layout-row'),
			layoutRowAria: t('page.dashboard.tile.layout-row-aria'),
			resizeDown: t('page.dashboard.tile.resize-down'),
			resizeDownAria: t('page.dashboard.tile.resize-down-aria'),
			resizeNarrow: t('page.dashboard.tile.resize-narrow'),
			resizeNarrowAria: t('page.dashboard.tile.resize-narrow-aria'),
			resizeUp: t('page.dashboard.tile.resize-up'),
			resizeUpAria: t('page.dashboard.tile.resize-up-aria'),
			resizeWide: t('page.dashboard.tile.resize-wide'),
			resizeWideAria: t('page.dashboard.tile.resize-wide-aria'),
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
	const handleResizeNarrow = useCallback(() => {
		onResizeWidth?.(id, -COL_RESIZE_STEP);
	}, [id, onResizeWidth]);
	const handleResizeWide = useCallback(() => {
		onResizeWidth?.(id, COL_RESIZE_STEP);
	}, [id, onResizeWidth]);
	const handleHideToggle = useCallback(() => {
		onToggleVisibility?.(id);
	}, [id, onToggleVisibility]);
	const handleOrientationToggle = useCallback(() => {
		onToggleOrientation?.(id, orientation);
	}, [id, onToggleOrientation, orientation]);

	return (
		<BentoTileRoot
			colSpan={colSpan}
			data-testid={`dashboard-tile-${id}`}
			id={`dashboard-tile-${id}`}
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
				id={`${id}-region`}
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
						onOrientationToggle={
							onToggleOrientation ? handleOrientationToggle : undefined
						}
						onResizeDown={onResize ? handleResizeDown : undefined}
						onResizeNarrow={onResizeWidth ? handleResizeNarrow : undefined}
						onResizeUp={onResize ? handleResizeUp : undefined}
						onResizeWide={onResizeWidth ? handleResizeWide : undefined}
						orientation={orientation}
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
								titleId={titleId}
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
