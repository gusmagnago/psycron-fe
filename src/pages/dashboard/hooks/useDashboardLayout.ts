import { useCallback, useRef, useState } from 'react';
import { capture } from '@psycron/analytics/posthog/events';
import { PostHogEvent } from '@psycron/analytics/posthog/types';

import type {
	DashboardDragState,
	DashboardLayoutState,
	DashboardTileId,
} from '../Dashboard.types';

const STORAGE_KEY = '_psy_dashboard_layout';

const DEFAULT_LAYOUT: DashboardLayoutState = [
	{ id: 'schedule', order: 0, visible: true },
	{ id: 'jupiter-insights', order: 1, visible: true },
	{ id: 'quick-actions', order: 2, visible: true },
	{ id: 'active-patients', order: 3, visible: true },
	{ id: 'revenue-mtd', order: 4, visible: true },
	{ id: 'weekly-chart', order: 5, visible: true },
];

const loadLayout = (): DashboardLayoutState => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return DEFAULT_LAYOUT;
		const parsed = JSON.parse(raw) as DashboardLayoutState;
		// Ensure new tiles from DEFAULT_LAYOUT are always included
		const existingIds = new Set(parsed.map((t) => t.id));
		const merged = [...parsed];
		DEFAULT_LAYOUT.forEach((def) => {
			if (!existingIds.has(def.id)) {
				merged.push({ ...def, order: merged.length });
			}
		});
		return merged;
	} catch {
		return DEFAULT_LAYOUT;
	}
};

const persist = (layout: DashboardLayoutState): void => {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
	} catch {
		// Storage unavailable — layout lives in memory only
	}
};

export interface UseDashboardLayoutReturn {
	dragState: DashboardDragState;
	isCustomizing: boolean;
	layout: DashboardLayoutState;
	onDragEnd: () => void;
	onDragOver: (overId: DashboardTileId) => void;
	onDragStart: (id: DashboardTileId) => void;
	resetLayout: () => void;
	setCustomizing: (value: boolean) => void;
	toggleVisibility: (id: DashboardTileId) => void;
}

export const useDashboardLayout = (): UseDashboardLayoutReturn => {
	const [layout, setLayout] = useState<DashboardLayoutState>(loadLayout);
	const [isCustomizing, setIsCustomizing] = useState(false);
	const [dragState, setDragState] = useState<DashboardDragState>({
		draggingId: null,
		overId: null,
	});
	const fromIndexRef = useRef<number>(0);

	const setCustomizing = useCallback((value: boolean) => {
		if (value) capture(PostHogEvent.DashboardCustomizeOpened);
		setIsCustomizing(value);
	}, []);

	const onDragStart = useCallback(
		(id: DashboardTileId) => {
			const tile = layout.find((t) => t.id === id);
			fromIndexRef.current = tile?.order ?? 0;
			setDragState({ draggingId: id, overId: null });
		},
		[layout]
	);

	const onDragOver = useCallback((overId: DashboardTileId) => {
		setDragState((prev) => ({ ...prev, overId }));
	}, []);

	const onDragEnd = useCallback(() => {
		const { draggingId, overId } = dragState;
		if (!draggingId || !overId || draggingId === overId) {
			setDragState({ draggingId: null, overId: null });
			return;
		}

		setLayout((prev) => {
			const sorted = [...prev].sort((a, b) => a.order - b.order);
			const fromIdx = sorted.findIndex((t) => t.id === draggingId);
			const toIdx = sorted.findIndex((t) => t.id === overId);
			if (fromIdx === -1 || toIdx === -1) return prev;

			const reordered = [...sorted];
			const [moved] = reordered.splice(fromIdx, 1);
			reordered.splice(toIdx, 0, moved);
			const next = reordered.map((t, i) => ({ ...t, order: i }));

			persist(next);

			capture(PostHogEvent.DashboardTileReordered, {
				from_index: fromIndexRef.current,
				tile_id: draggingId,
				to_index: toIdx,
			});

			return next;
		});

		setDragState({ draggingId: null, overId: null });
	}, [dragState]);

	const toggleVisibility = useCallback((id: DashboardTileId) => {
		setLayout((prev) => {
			const next = prev.map((t) =>
				t.id === id ? { ...t, visible: !t.visible } : t
			);
			persist(next);
			const tile = next.find((t) => t.id === id);
			if (tile?.visible) {
				capture(PostHogEvent.DashboardTileRestored, { tile_id: id });
			} else {
				capture(PostHogEvent.DashboardTileHidden, { tile_id: id });
			}
			return next;
		});
	}, []);

	const resetLayout = useCallback(() => {
		setLayout(DEFAULT_LAYOUT);
		persist(DEFAULT_LAYOUT);
	}, []);

	return {
		dragState,
		isCustomizing,
		layout,
		onDragEnd,
		onDragOver,
		onDragStart,
		resetLayout,
		setCustomizing,
		toggleVisibility,
	};
};
