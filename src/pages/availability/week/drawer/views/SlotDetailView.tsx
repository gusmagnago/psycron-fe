import {
	DrawerDetailIcon,
	DrawerDetailLabel,
	DrawerDetailRow,
	DrawerDetailsList,
	DrawerDetailSub,
	DrawerDetailValue,
	DrawerDetailWrapper,
} from '../AvailabilityWeekDrawer.styles';
import type { IDrawerDetail } from '../AvailabilityWeekDrawer.types';

interface ISlotDetailViewProps {
	details: IDrawerDetail[];
}

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
