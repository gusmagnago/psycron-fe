import { useCallback, useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { capture } from '@psycron/analytics/posthog/events';
import { PostHogEvent } from '@psycron/analytics/posthog/types';

import type {
	DashboardLayoutState,
	DashboardTileId,
	DashboardTileOrientation,
} from '../Dashboard.types';

import type { UseDashboardLayoutReturn } from './useDashboardLayout.types';

const STORAGE_KEY = '_psy_dashboard_layout';
const STORAGE_VERSION = 4;
const MAX_HEIGHT_DELTA = 4;
const MIN_HEIGHT_DELTA = -1;

// Order keeps the hero section aligned with the dashboard v4 preview:
// greeting(6) + glance(6), then operational tiles below.
const DEFAULT_LAYOUT: DashboardLayoutState = [
	{ id: 'greeting', order: 0, visible: true },
	{ id: 'glance', order: 1, visible: true },
	{ id: 'quick-actions', order: 2, visible: true },
	{ id: 'schedule', order: 3, visible: true },
	{ id: 'practice-readiness', order: 4, visible: true },
	{ id: 'revenue', order: 5, visible: true },
	{ id: 'pending-tasks', order: 6, visible: true },
	{ id: 'notifications', order: 7, visible: true },
	{ id: 'action-center', order: 8, visible: true },
	{ id: 'recent-patients', order: 9, visible: true },
	{ id: 'session-analytics', order: 10, visible: true },
];

interface StoredDashboardLayout {
	tiles: DashboardLayoutState;
	version: number;
}

const LEGACY_TILE_IDS: Record<string, DashboardTileId> = {
	'billing-readiness': 'practice-readiness',
	'revenue-mtd': 'practice-readiness',
	'this-week': 'session-analytics',
	'weekly-chart': 'session-analytics',
};

const normalizeTileId = (id: string): DashboardTileId | null => {
	const nextId = LEGACY_TILE_IDS[id] ?? id;
	return DEFAULT_LAYOUT.some((tile) => tile.id === nextId)
		? (nextId as DashboardTileId)
		: null;
};

const normalizeOrientation = (
	value: DashboardTileOrientation | undefined
): DashboardTileOrientation | undefined =>
	value === 'column' || value === 'row' ? value : undefined;

const getStoredLayout = (
	parsed: DashboardLayoutState | StoredDashboardLayout
): { tiles: DashboardLayoutState; version: number } => {
	if (Array.isArray(parsed)) return { tiles: parsed, version: 1 };
	return {
		tiles: Array.isArray(parsed.tiles) ? parsed.tiles : [],
		version: Number.isFinite(parsed.version) ? parsed.version : 1,
	};
};

const normalizeTiles = (tiles: DashboardLayoutState): DashboardLayoutState =>
	tiles.reduce<DashboardLayoutState>((acc, tile) => {
		const id = normalizeTileId(tile.id);
		if (!id || acc.some((item) => item.id === id)) return acc;
		acc.push({
			...tile,
			id,
			orientation: normalizeOrientation(tile.orientation),
		});
		return acc;
	}, []);

const mergeWithDefaults = (
	tiles: DashboardLayoutState,
	useDefaultOrder: boolean
): DashboardLayoutState => {
	const normalized = normalizeTiles(tiles);
	const savedById = new Map(normalized.map((tile) => [tile.id, tile]));

	if (useDefaultOrder) {
		return DEFAULT_LAYOUT.map((def, order) => {
			const saved = savedById.get(def.id);
			return {
				...def,
				heightDelta: saved?.heightDelta,
				order,
				orientation: normalizeOrientation(saved?.orientation),
				visible: saved?.visible ?? def.visible,
			};
		});
	}

	const existingIds = new Set(normalized.map((tile) => tile.id));
	const merged = [...normalized].sort((a, b) => a.order - b.order);
	DEFAULT_LAYOUT.forEach((def) => {
		if (!existingIds.has(def.id)) {
			merged.push({ ...def, order: merged.length });
		}
	});

	return merged.map((tile, order) => ({ ...tile, order }));
};

const loadLayout = (): DashboardLayoutState => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return DEFAULT_LAYOUT;
		const stored = getStoredLayout(JSON.parse(raw));
		return mergeWithDefaults(stored.tiles, stored.version !== STORAGE_VERSION);
	} catch {
		return DEFAULT_LAYOUT;
	}
};

const persist = (layout: DashboardLayoutState): void => {
	try {
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({ tiles: layout, version: STORAGE_VERSION })
		);
	} catch {
		// Storage unavailable — layout lives in memory only
	}
};

const normalizeHeightDelta = (value: number | undefined): number | undefined => {
	if (!value) return undefined;
	return Math.min(Math.max(value, MIN_HEIGHT_DELTA), MAX_HEIGHT_DELTA);
};

const getNextOrientation = (
	orientation: DashboardTileOrientation | undefined
): DashboardTileOrientation => (orientation === 'column' ? 'row' : 'column');

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

	const toggleTileOrientation = useCallback(
		(
			id: DashboardTileId,
			currentOrientation?: DashboardTileOrientation
		) => {
			setLayout((prev) => {
				const next = prev.map((tile) => {
					if (tile.id !== id) return tile;
					return {
						...tile,
						orientation: getNextOrientation(currentOrientation ?? tile.orientation),
					};
				});
				persist(next);
				const tile = next.find((item) => item.id === id);
				if (tile?.orientation) {
					capture(PostHogEvent.DashboardTileOrientationToggled, {
						orientation: tile.orientation,
						tile_id: id,
					});
				}
				return next;
			});
		},
		[]
	);

	const resizeTileWidth = useCallback((id: DashboardTileId, delta: number) => {
		setLayout((prev) => {
			const next = prev.map((tile) => {
				if (tile.id !== id) return tile;
				return { ...tile, colDelta: (tile.colDelta ?? 0) + delta };
			});
			persist(next);
			return next;
		});
	}, []);

	const resetLayout = useCallback(() => {
		setLayout(DEFAULT_LAYOUT);
		persist(DEFAULT_LAYOUT);
		setIsCustomizing(false);
		capture(PostHogEvent.DashboardLayoutReset);
	}, []);

	const organizeLayout = useCallback(() => {
		setLayout((prev) => {
			const visibilityMap = new Map(prev.map((t) => [t.id, t.visible]));
			const organized = DEFAULT_LAYOUT.map((def) => ({
				...def,
				colDelta: undefined,
				heightDelta: undefined,
				orientation: undefined,
				visible: visibilityMap.get(def.id) ?? def.visible,
			}));
			persist(organized);
			capture(PostHogEvent.DashboardLayoutOrganized);
			return organized;
		});
		setIsCustomizing(false);
	}, []);

	return {
		isCustomizing,
		layout,
		organizeLayout,
		reorderLayout,
		resizeTile,
		resizeTileWidth,
		resetLayout,
		setCustomizing,
		toggleTileOrientation,
		toggleVisibility,
	};
};
