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

export interface IUseDrawerActionsInput {
	blockSlot: IBlockSlotActions;
	cancelSlot: ICancelSlotActions;
	editSlotForm: IEditSlotFormActions;
	hasConflict: boolean;
	isAvailable: boolean;
	isBlocked: boolean;
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
	cancelSlot,
	editSlotForm,
	hasConflict,
	isAvailable,
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
