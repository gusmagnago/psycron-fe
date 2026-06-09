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

	useEffect(() => {
		if (!context) return undefined;

		context.setChrome({
			actions,
			expandedContent,
			footer,
			headerActions,
			icon,
			titleId,
			title,
		});

		return () => {
			context.setChrome({});
		};
	}, [actions, context, expandedContent, footer, headerActions, icon, titleId, title]);
};
