import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import {
	PromptBanner,
	PromptButton,
	PromptText,
} from './PracticeImportPrompt.styles';
import { PracticeImportReview } from './PracticeImportReview';
import { usePracticeImport } from './usePracticeImport';

interface PracticeImportPromptProps {
	therapistId?: string;
}

/**
 * Banner shown on the availability page after a Google sync when the importer
 * detected patients in the booked events. Opens the review-and-commit modal —
 * either directly, or automatically when arrived here from a dashboard nudge
 * (via `location.state.openPracticeImport`).
 */
export const PracticeImportPrompt = ({
	therapistId,
}: PracticeImportPromptProps) => {
	const { t } = useTranslation();
	const location = useLocation();
	const navigate = useNavigate();
	const [isReviewOpen, setIsReviewOpen] = useState(false);
	const { preview } = usePracticeImport(therapistId);

	const count = preview.data?.summary.patientsFound ?? 0;

	// Open the modal when navigated here from a dashboard nudge, then clear the
	// flag so a refresh/back doesn't re-open it.
	useEffect(() => {
		const state = location.state as { openPracticeImport?: boolean } | null;
		if (state?.openPracticeImport) {
			setIsReviewOpen(true);
			navigate(location.pathname, { replace: true, state: {} });
		}
	}, [location, navigate]);

	if (!therapistId) return null;

	return (
		<>
			{count > 0 && (
				<PromptBanner
					data-testid='practice-import-prompt'
					id='practice-import-prompt'
				>
					<PromptText
						data-testid='practice-import-prompt-text'
						id='practice-import-prompt-text'
					>
						<Trans
							i18nKey='practice-import.prompt'
							values={{ count }}
							components={{ strong: <strong /> }}
						/>
					</PromptText>
					<PromptButton
						small
						onClick={() => setIsReviewOpen(true)}
						data-testid='practice-import-prompt-review'
						id='practice-import-prompt-review'
					>
						{t('practice-import.review-cta')}
					</PromptButton>
				</PromptBanner>
			)}
			<PracticeImportReview
				open={isReviewOpen}
				onClose={() => setIsReviewOpen(false)}
				therapistId={therapistId}
			/>
		</>
	);
};
