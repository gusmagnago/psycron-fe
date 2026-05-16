import { useCallback, useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { capture } from '@psycron/analytics/posthog/events';
import { PostHogEvent } from '@psycron/analytics/posthog/types';

import type {
	DashboardLayoutState,
	DashboardTileId,
} from '../Dashboard.types';

import type { UseDashboardLayoutReturn } from './useDashboardLayout.types';

const STORAGE_KEY = '_psy_dashboard_layout';
const MAX_HEIGHT_DELTA = 4;
const MIN_HEIGHT_DELTA = -1;

const DEFAULT_LAYOUT: DashboardLayoutState = [
	{ id: 'schedule', order: 0, visible: true },
	{ id: 'jupiter-insights', order: 1, visible: true },
	{ id: 'quick-actions', order: 2, visible: true },
	{ id: 'billing-readiness', order: 3, visible: true },
	{ id: 'this-week', order: 4, visible: true },
	{ id: 'weekly-chart', order: 5, visible: true },
	{ id: 'pending-tasks', order: 6, visible: true },
	{ id: 'recent-patients', order: 7, visible: true },
];

const LEGACY_TILE_IDS: Record<string, DashboardTileId> = {
	'revenue-mtd': 'billing-readiness',
};

const normalizeTileId = (id: string): DashboardTileId | null => {
	const nextId = LEGACY_TILE_IDS[id] ?? id;
	return DEFAULT_LAYOUT.some((tile) => tile.id === nextId)
		? (nextId as DashboardTileId)
		: null;
};

const loadLayout = (): DashboardLayoutState => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return DEFAULT_LAYOUT;
		const parsed = JSON.parse(raw) as DashboardLayoutState;
		const normalized = parsed.reduce<DashboardLayoutState>((acc, tile) => {
			const id = normalizeTileId(tile.id);
			if (!id || acc.some((item) => item.id === id)) return acc;
			acc.push({ ...tile, id });
			return acc;
		}, []);
		const existingIds = new Set(normalized.map((t) => t.id));
		const merged = [...normalized];
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

const normalizeHeightDelta = (value: number | undefined): number | undefined => {
	if (!value) return undefined;
	return Math.min(Math.max(value, MIN_HEIGHT_DELTA), MAX_HEIGHT_DELTA);
};

export const useDashboardLayout = (): UseDashboardLayoutReturn => {
	const [layout, setLayout] = useState<DashboardLayoutState>(loadLayout);
	const [isCustomizing, setIsCustomizing] = useState(false);

	const setCustomizing = useCallback((value: boolean) => {
		if (value) capture(PostHogEvent.DashboardCustomizeOpened);
		setIsCustomizing(value);
	}, []);

	const reorderLayout = useCallback(
		(activeId: DashboardTileId, overId: DashboardTileId) => {
			setLayout((prev) => {
				const sorted = [...prev].sort((a, b) => a.order - b.order);
				const fromIdx = sorted.findIndex((t) => t.id === activeId);
				const toIdx = sorted.findIndex((t) => t.id === overId);
				if (fromIdx === -1 || toIdx === -1) return prev;
				const reordered = arrayMove(sorted, fromIdx, toIdx).map((t, i) => ({
					...t,
					order: i,
				}));
				persist(reordered);
				return reordered;
			});
		},
		[]
	);

	const resizeTile = useCallback((id: DashboardTileId, delta: number) => {
		setLayout((prev) => {
			const next = prev.map((tile) => {
				if (tile.id !== id) return tile;
				const heightDelta = normalizeHeightDelta(
					(tile.heightDelta ?? 0) + delta
				);
				return { ...tile, heightDelta };
			});
			persist(next);
			return next;
		});
	}, []);

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
		setIsCustomizing(false);
		capture(PostHogEvent.DashboardLayoutReset);
	}, []);

	return {
		isCustomizing,
		layout,
		reorderLayout,
		resizeTile,
		resetLayout,
		setCustomizing,
		toggleVisibility,
	};
};
