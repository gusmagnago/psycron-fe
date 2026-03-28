import { CancellationReasonEnum } from '@psycron/api/user/availability/index.types';

export const CANCEL_REASONS = [
	CancellationReasonEnum.EMERGENCY,
	CancellationReasonEnum.SCHEDULE_CONFLICT,
	CancellationReasonEnum.FINANCIAL_ISSUES,
	CancellationReasonEnum.MENTAL_HEALTH,
	CancellationReasonEnum.NO_SHOW,
	CancellationReasonEnum.OTHER,
] as const;
