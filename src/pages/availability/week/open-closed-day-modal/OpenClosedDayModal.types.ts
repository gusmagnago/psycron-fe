import type { AvailabilityDateOverrideMode } from '@psycron/api/user/availability/index.types';

export interface OpenClosedDayModalProps {
	endTime: string;
	isConfirmDisabled: boolean;
	isLoading: boolean;
	mode: AvailabilityDateOverrideMode;
	onClose: () => void;
	onConfirm: () => void;
	onEndTimeChange: (value: string) => void;
	onModeChange: (mode: AvailabilityDateOverrideMode) => void;
	onSpecificSlotToggle: (startTime: string) => void;
	onStartTimeChange: (value: string) => void;
	openDate: string | null;
	overrideSlotOptions: string[];
	partialSlotOptions: string[];
	selectedSpecificSlots: string[];
	startTime: string;
}
