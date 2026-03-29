import {
	DrawerDetailIcon,
	DrawerDetailLabel,
	DrawerDetailRow,
	DrawerDetailsList,
	DrawerDetailSub,
	DrawerDetailValue,
	DrawerDetailWrapper,
} from '../../AvailabilityWeekDrawer.styles';

import type { ISlotDetailViewProps } from './SlotDetailView.types';

export const SlotDetailView = ({ details }: ISlotDetailViewProps) => (
	<DrawerDetailsList>
		{details.map(({ icon, key, label, sub, value }) => (
			<DrawerDetailRow key={key}>
				<DrawerDetailIcon>{icon}</DrawerDetailIcon>
				<DrawerDetailWrapper>
					<DrawerDetailLabel>{label}</DrawerDetailLabel>
					<DrawerDetailValue>{value}</DrawerDetailValue>
					{sub && <DrawerDetailSub>{sub}</DrawerDetailSub>}
				</DrawerDetailWrapper>
			</DrawerDetailRow>
		))}
	</DrawerDetailsList>
);
