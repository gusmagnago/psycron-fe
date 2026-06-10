import {
	createContext,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	useContext,
	useEffect,
} from 'react';

export interface BentoTileChromeState {
	actions?: ReactNode;
	expandedContent?: ReactNode;
	footer?: ReactNode;
	headerActions?: ReactNode;
	icon?: ReactNode;
	title?: ReactNode;
	titleId?: string;
}

interface BentoTileChromeContextValue {
	setChrome: Dispatch<SetStateAction<BentoTileChromeState>>;
}

const CHROME_KEYS: (keyof BentoTileChromeState)[] = [
	'actions',
	'expandedContent',
	'footer',
	'headerActions',
	'icon',
	'title',
	'titleId',
];

export const isSameChrome = (
	a: BentoTileChromeState,
	b: BentoTileChromeState
): boolean => CHROME_KEYS.every((key) => Object.is(a[key], b[key]));

export const BentoTileChromeContext =
	createContext<BentoTileChromeContextValue | null>(null);

export const useBentoTileChrome = ({
	actions,
	expandedContent,
	footer,
	headerActions,
	icon,
	titleId,
	title,
}: BentoTileChromeState): void => {
	const context = useContext(BentoTileChromeContext);

	// Publish this tile's chrome. The host's `setChrome` shallow-compares and
	// bails when nothing changed, so re-runs triggered by non-memoized ReactNode
	// props are cheap and never re-render the tile redundantly (review FE #101,
	// finding 10).
	useEffect(() => {
		context?.setChrome({
			actions,
			expandedContent,
			footer,
			headerActions,
			icon,
			titleId,
			title,
		});
	}, [actions, context, expandedContent, footer, headerActions, icon, titleId, title]);

	// Reset chrome only when the widget unmounts — not on every dep change.
	// Resetting per-render caused a transient empty-chrome flash.
	useEffect(() => {
		if (!context) return undefined;

		return () => {
			context.setChrome({});
		};
	}, [context]);
};
