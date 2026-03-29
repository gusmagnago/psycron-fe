import type { CancellationReasonEnum as CancellationReasonType } from '@psycron/api/user/availability/index.types';

export interface ISlotCancelReasonFormProps {
	customReason: string;
	onCustomReasonChange: (val: string) => void;
	onReasonChange: (val: CancellationReasonType) => void;
	reasonCode: CancellationReasonType | null;
}
