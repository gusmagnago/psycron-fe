import { useTranslation } from 'react-i18next';

import type {
	DrawerView,
	IRescheduleSlot,
} from '../AvailabilityWeekDrawer.types';
import type { IDrawerActionsConfig } from '../components/DrawerActions.types';

interface IBlockSlotActions {
	blockReason?: string;
	mutation: { isPending: boolean; mutate: () => void };
	setBlockReason?: (reason: string) => void;
}

interface ICancelSlotActions {
	mutation: { isPending: boolean; mutate: () => void };
	reasonCode: unknown;
	reset: () => void;
}

interface IEditSlotFormActions {
	isDirty: boolean;
	mutation: { isPending: boolean; mutate: () => void };
}

interface IRescheduleActions {
	mutation: { isPending: boolean; mutate: () => void };
	selectedSlot: IRescheduleSlot | null;
	setSelectedSlot: (s: IRescheduleSlot | null) => void;
}

interface IBufferTimeActions {
	inputIsValid: boolean;
	removeMutation: { isPending: boolean; mutate: () => void };
	reset: () => void;
	saveMutation: { isPending: boolean; mutate: () => void };
}

export interface IUseDrawerActionsInput {
	blockSlot: IBlockSlotActions;
	bufferTime: IBufferTimeActions;
	cancelSlot: ICancelSlotActions;
	editSlotForm: IEditSlotFormActions;
	hasConflict: boolean;
	isAvailable: boolean;
	isBlocked: boolean;
	isBuffer: boolean;
	isCancelled: boolean;
	isChecking: boolean;
	isPast?: boolean;
	isSubmitting: boolean;
	reschedule: IRescheduleActions;
	setView: (view: DrawerView) => void;
	submitBooking: () => void;
	unblockSlot: IBlockSlotActions;
	view: DrawerView;
}

export const useDrawerActions = ({
	blockSlot,
	bufferTime,
	cancelSlot,
	editSlotForm,
	hasConflict,
	isAvailable,
	isBuffer,
	isBlocked,
	isCancelled,
	isChecking,
	isPast,
	isSubmitting,
	reschedule,
	setView,
	submitBooking,
	unblockSlot,
	view,
}: IUseDrawerActionsInput): IDrawerActionsConfig => {
	const { t } = useTranslation();

	switch (view) {
		case 'buffer-edit':
			return {
				primary: {
					disabled: bufferTime.saveMutation.isPending || !bufferTime.inputIsValid,
					label: t('availability.week.drawer.break-edit-save'),
					loading: bufferTime.saveMutation.isPending,
					onClick: () => bufferTime.saveMutation.mutate(),
					tertiary: true,
					variant: 'contained',
				},
				secondary: {
					disabled: bufferTime.saveMutation.isPending,
					label: t('common.cancel'),
					onClick: () => {
						bufferTime.reset();
						setView('default');
					},
				},
			};

		case 'editing':
			return {
				primary: {
					disabled: editSlotForm.mutation.isPending || !editSlotForm.isDirty,
					label: t('availability.week.drawer.edit-save'),
					loading: editSlotForm.mutation.isPending,
					onClick: () => editSlotForm.mutation.mutate(),
					tertiary: true,
					variant: 'contained',
				},
				secondary: {
					disabled: editSlotForm.mutation.isPending,
					label: t('common.cancel'),
					onClick: () => setView('default'),
				},
			};

		case 'block-confirm':
			return {
				primary: {
					disabled: blockSlot.mutation.isPending,
					label: t('availability.week.drawer.block-confirm'),
					loading: blockSlot.mutation.isPending,
					onClick: () => blockSlot.mutation.mutate(),
					severity: 'error',
					variant: 'contained',
				},
				secondary: {
					disabled: blockSlot.mutation.isPending,
					label: t('availability.week.drawer.cancel-back'),
					onClick: () => setView('default'),
				},
			};

		case 'reschedule-or-cancel':
			return {
				primary: {
					label: t('availability.week.drawer.cancel-back'),
					onClick: () => setView('default'),
				},
			};

		case 'cancel-reason':
			return {
				primary: {
					disabled: !cancelSlot.reasonCode || cancelSlot.mutation.isPending,
					label: t('availability.week.drawer.cancel-confirm'),
					loading: cancelSlot.mutation.isPending,
					onClick: () => cancelSlot.mutation.mutate(),
					severity: 'error',
					variant: 'contained',
				},
				secondary: {
					disabled: cancelSlot.mutation.isPending,
					label: t('availability.week.drawer.cancel-back'),
					onClick: () => {
						setView('reschedule-or-cancel');
						cancelSlot.reset();
					},
				},
			};

		case 'reschedule-slots':
			return {
				primary: {
					disabled: !reschedule.selectedSlot || reschedule.mutation.isPending,
					label: t('availability.week.drawer.reschedule-confirm'),
					loading: reschedule.mutation.isPending,
					onClick: () => reschedule.mutation.mutate(),
					tertiary: true,
					variant: 'contained',
				},
				secondary: {
					disabled: reschedule.mutation.isPending,
					label: t('availability.week.drawer.cancel-back'),
					onClick: () => {
						setView('reschedule-or-cancel');
						reschedule.setSelectedSlot(null);
					},
				},
			};

		case 'unblock-confirm':
			return {
				primary: {
					disabled: unblockSlot.mutation.isPending,
					label: t('availability.week.drawer.unblock-confirm'),
					loading: unblockSlot.mutation.isPending,
					onClick: () => unblockSlot.mutation.mutate(),
					tertiary: true,
					variant: 'contained',
				},
				secondary: {
					disabled: unblockSlot.mutation.isPending,
					label: t('availability.week.drawer.cancel-back'),
					onClick: () => setView('default'),
				},
			};

		default:
			if (isBlocked) {
				return {
					primary: {
						label: t('availability.week.drawer.unblock-slot'),
						onClick: () => setView('unblock-confirm'),
						tertiary: true,
					},
				};
			}

			if (isBuffer) {
				return {
					primary: {
						label: t('availability.week.drawer.break-edit'),
						onClick: () => setView('buffer-edit'),
						tertiary: true,
					},
					secondary: {
						disabled: bufferTime.removeMutation.isPending,
						label: t('availability.week.drawer.break-remove'),
						onClick: () => bufferTime.removeMutation.mutate(),
						severity: 'error',
					},
				};
			}

			if (isCancelled) {
				return {
					primary: {
						label: t('availability.week.drawer.reopen-slot'),
						onClick: () => setView('unblock-confirm'),
						tertiary: true,
					},
				};
			}

			if (isAvailable) {
				if (hasConflict) return {};

				return {
					primary: {
						disabled: isSubmitting || isChecking,
						label: t('availability.week.drawer.confirm-booking'),
						loading: isSubmitting || isChecking,
						onClick: submitBooking,
						tertiary: true,
						variant: 'contained',
					},
					secondary: {
						label: t('availability.week.drawer.block-slot'),
						onClick: () => setView('block-confirm'),
						severity: 'error',
					},
				};
			}

			if (isPast) return {};

			return {
				primary: {
					label: t('availability.week.drawer.edit'),
					onClick: () => setView('editing'),
					tertiary: true,
				},
				secondary: {
					label: t('availability.week.drawer.cancel-appointment'),
					onClick: () => setView('reschedule-or-cancel'),
					severity: 'error',
				},
			};
	}
};
