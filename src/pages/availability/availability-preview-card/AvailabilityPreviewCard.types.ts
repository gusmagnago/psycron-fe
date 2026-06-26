import type {
	JupiterAnswers,
	JupiterPublishOutcome,
} from '../jupiter-conversation/JupiterConversation.types';

export interface IAvailabilityPreviewCardProps {
	answers: JupiterAnswers;
	detectedTimezone: string;
	isPublishing: boolean;
	// Leave the 'sync-pending' state without a successful sync.
	onContinueWithoutSync: () => void;
	// Returns the publish outcome so the card can either show its success state
	// (before the flow navigates away) or surface the in-place sync retry.
	onPublish: () => Promise<JupiterPublishOutcome> | JupiterPublishOutcome;
	onReset: () => void;
	// Retry the Google sync from the 'sync-pending' state. Resolves true on a
	// successful sync (the flow then navigates away).
	onRetrySync: () => Promise<boolean>;
}
