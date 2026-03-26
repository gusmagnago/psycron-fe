import { useState } from 'react';
import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';
// import { useParams } from 'react-router-dom';
import { Box, Grid, IconButton, Modal } from '@mui/material';
// import type { IDateInfo } from '@psycron/api/user/index.types';
import { ShareButton } from '@psycron/components/button/share/ShareButton';
import { Close } from '@psycron/components/icons';
// import { useAvailability } from '@psycron/context/appointment/availability/AvailabilityContext';
import { useUserDetails } from '@psycron/context/user/details/UserDetailsContext';
import { PageLayout } from '@psycron/layouts/app/pages-layout/PageLayout';
import { spacing } from '@psycron/theme/spacing/spacing.theme';

// import { startOfToday } from 'date-fns';
// import { enGB, ptBR } from 'date-fns/locale';
// import { AVAILABILITYWIZARD } from '../urls';
import { StyledPaperModal } from './Dashboard.styles';

export const Dashboard = () => {
	const { t } = useTranslation();
	// const { locale } = useParams<{ locale: string }>();
	// const navigate = useNavigate();

	const { userDetails } = useUserDetails();

	// const dateLocale = locale.includes('en') ? enGB : ptBR;
	// const today = startOfToday();

	// const [selectedDay, setSelectedDay] = useState<IDateInfo | null>(null);
	const [isDateClicked, setIsDateClicked] = useState<boolean>(false);

	// const {
	// 	availabilityData,
	// 	availabilityDataIsLoading,
	// 	isAvailabilityDatesEmpty,
	// 	firstDate,
	// 	lastDate,
	// } = useAvailability();

	// const handleDayClick = useCallback(
	// 	(day: IDateInfo) => {
	// 		setIsDateClicked(true);
	// 		setSelectedDay(day);
	// 	},
	// 	[setIsDateClicked]
	// );

	// const createAvailabilityLink = () => navigate(`../${AVAILABILITYWIZARD}`);

	return (
		<PageLayout title='Dashboard' isLoading={false}>
			<Grid
				container
				columns={12}
				p={spacing.medium}
				columnSpacing={spacing.medium}
			>
				<Grid size={{ md: 4, xs: 12, sm: 5, lg: 3 }} height={300}></Grid>
			</Grid>
			<Modal open={isDateClicked} onClose={() => setIsDateClicked(false)}>
				<StyledPaperModal>
					<Box display='flex' justifyContent='flex-end'>
						<IconButton onClick={() => setIsDateClicked(false)}>
							<Close />
						</IconButton>
					</Box>
					<Box display='flex' justifyContent='flex-end'>
						<ShareButton
							titleKey={t(
								'components.share-button.share-infos.availability.title',
								{ therapistName: userDetails?.firstName }
							)}
							textKey={t(
								'components.share-button.share-infos.availability.text'
							)}
							url={`${userDetails?._id}/book-appointment`}
							shareWith={t('components.share-button.share-with-patients')}
						/>
					</Box>
				</StyledPaperModal>
			</Modal>
		</PageLayout>
	);
};
