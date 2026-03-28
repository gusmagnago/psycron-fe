import { useTranslation } from 'react-i18next';
import { MenuItem, TextField } from '@mui/material';
import type { CancellationReasonEnum as CancellationReasonType } from '@psycron/api/user/availability/index.types';
import { CancellationReasonEnum } from '@psycron/api/user/availability/index.types';

import { CANCEL_REASONS } from '../AvailabilityWeekDrawer.constants';
import { FormWrapper } from '../AvailabilityWeekDrawer.styles';

interface ISlotCancelReasonFormProps {
	customReason: string;
	onCustomReasonChange: (val: string) => void;
	onReasonChange: (val: CancellationReasonType) => void;
	reasonCode: CancellationReasonType | null;
}

export const SlotCancelReasonForm = ({
	customReason,
	onCustomReasonChange,
	onReasonChange,
	reasonCode,
}: ISlotCancelReasonFormProps) => {
	const { t } = useTranslation();

	return (
		<FormWrapper>
			<TextField
				select
				fullWidth
				label={t('availability.week.drawer.cancel-reason-label')}
				onChange={(e) =>
					onReasonChange(Number(e.target.value) as CancellationReasonType)
				}
				size='small'
				value={reasonCode ?? ''}
			>
				{CANCEL_REASONS.map((val) => (
					<MenuItem key={val} value={val}>
						{t(`globals.cancellation-reason.${val}`)}
					</MenuItem>
				))}
			</TextField>
			{reasonCode === CancellationReasonEnum.OTHER && (
				<TextField
					fullWidth
					label={t('availability.week.drawer.cancel-custom-reason-label')}
					maxRows={3}
					multiline
					onChange={(e) => onCustomReasonChange(e.target.value)}
					size='small'
					value={customReason}
				/>
			)}
		</FormWrapper>
	);
};
