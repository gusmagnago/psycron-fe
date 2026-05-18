import { type ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { capture } from '@psycron/analytics/posthog/events';
import { PostHogEvent } from '@psycron/analytics/posthog/types';
import { submitDashboardWidgetFeedback } from '@psycron/api/dashboard';
import { Modal } from '@psycron/components/modal/Modal';

import {
	InfoModalBody,
	InfoModalDescription,
	InfoModalError,
	InfoModalFeedbackSection,
	InfoModalFeedbackTextarea,
	InfoModalFutureHeading,
	InfoModalFutureSection,
	InfoModalFutureText,
	InfoModalThanks,
} from './WidgetInfoModal.styles';
import type { WidgetInfoModalProps } from './WidgetInfoModal.types';

const k = (widgetId: string, key: string) =>
	`page.dashboard.widgets.${widgetId}.info.${key}`;
const shared = (key: string) => `page.dashboard.widgets.info-modal.${key}`;
const widgetsWithFutureSection = new Set(['billing-readiness', 'revenue']);

export const WidgetInfoModal = ({
	isOpen,
	onClose,
	tier,
	widgetId,
}: WidgetInfoModalProps) => {
	const { t } = useTranslation();
	const [error, setError] = useState(false);
	const [feedback, setFeedback] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const showFutureSection = widgetsWithFutureSection.has(widgetId);

	useEffect(() => {
		if (!isOpen) return;
		capture(PostHogEvent.DashboardWidgetInfoOpened, {
			tier: tier ?? 'unknown',
			widget_id: widgetId,
		});
	}, [isOpen, tier, widgetId]);

	const handleClose = () => {
		setError(false);
		setFeedback('');
		setIsSubmitting(false);
		setSubmitted(false);
		onClose();
	};

	const handleSubmit = async () => {
		const trimmedFeedback = feedback.trim();
		if (!trimmedFeedback || isSubmitting) return;

		setError(false);
		setIsSubmitting(true);

		try {
			const result = await submitDashboardWidgetFeedback({
				feedback: trimmedFeedback,
				tier,
				widgetId,
			});

			capture(PostHogEvent.DashboardWidgetFeedbackSubmitted, {
				feedback: trimmedFeedback,
				feedback_id: result.id,
				tier: tier ?? 'unknown',
				widget_id: widgetId,
			});

			setSubmitted(true);
			setFeedback('');
		} catch {
			setError(true);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleFeedbackChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		if (error) setError(false);
		setFeedback(event.target.value);
	};

	const submitDisabled = !feedback.trim() || isSubmitting;

	return (
		<Modal
			cardActionsProps={
				submitted
					? { actionName: t('common.close'), onClick: handleClose }
					: {
							actionName: t(shared('feedback-submit')),
							disabled: submitDisabled,
							hasSecondAction: true,
							loading: isSubmitting,
							onClick: handleSubmit,
							secondAction: handleClose,
							secondActionName: t('common.close'),
						}
			}
			onClose={handleClose}
			openModal={isOpen}
			title={t(k(widgetId, 'title'))}
		>
			<InfoModalBody>
				<InfoModalDescription>{t(k(widgetId, 'description'))}</InfoModalDescription>

				{showFutureSection ? (
					<InfoModalFutureSection>
						<InfoModalFutureHeading>
							{t(shared('future-heading'))}
						</InfoModalFutureHeading>
						<InfoModalFutureText>{t(k(widgetId, 'future'))}</InfoModalFutureText>
					</InfoModalFutureSection>
				) : null}

				<InfoModalFeedbackSection>
					{submitted ? (
						<InfoModalThanks>{t(shared('feedback-thanks'))}</InfoModalThanks>
					) : (
						<>
							<InfoModalFeedbackTextarea
								onChange={handleFeedbackChange}
								placeholder={t(shared('feedback-placeholder'))}
								value={feedback}
							/>
							{error ? (
								<InfoModalError>{t(shared('feedback-error'))}</InfoModalError>
							) : null}
						</>
					)}
				</InfoModalFeedbackSection>
			</InfoModalBody>
		</Modal>
	);
};
