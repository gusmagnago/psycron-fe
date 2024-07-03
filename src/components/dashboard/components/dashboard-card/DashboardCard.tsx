import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Box, Divider, Modal, Typography } from '@mui/material';
import { Card } from '@psycron/components/card/Card';
import { Pause, Play } from '@psycron/components/icons';
import { Progress } from '@psycron/components/progress/Progress';
import { Tooltip } from '@psycron/components/tooltip/Tooltip';
import {
	addMilliseconds,
	addMinutes,
	differenceInMilliseconds,
	endOfDay,
	format,
	formatISO,
	isAfter,
	isBefore,
	isWithinInterval,
	parseISO,
	startOfDay,
} from 'date-fns';

import { DashboardCardItem } from '../dashboard-card-item/DashboardCardItem';
import type { IDashboarcCardItemProps } from '../dashboard-card-item/DashboardCardItem.types';

import {
	DashboardCardTitle,
	DashboardCardWrapper,
	ModalPauseTimerContent,
	Timer,
} from './DashboardCard.styles';
import type { IDashboardCardProps } from './DashboardCard.types';

export const DashboardCard = ({
	items,
	titleKey,
	icon,
	iconTitleKey,
	isPatientCard,
	navigateToURL,
}: IDashboardCardProps) => {
	const navigate = useNavigate();
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [shouldProceed, setShouldProceed] = useState<boolean>(true);
	const [startTime, setStartTime] = useState<number>(0);
	const [fullPausedTime, setFullPausedTime] = useState<number>(0);
	const [updatedItems, setUpdatedItems] = useState(items);
	const { t } = useTranslation();
	const intervalRef = useRef<number | null>(null);
	const nowDate = format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss');

	const updateAppointmentTimes = (
		items: IDashboarcCardItemProps[],
		pauseDuration: number
	) => {
		return items.map((appointment) => {
			const nextAppointment = parseISO(appointment.appointmentInfo.next);
			const updatedNextAppointment = addMilliseconds(
				nextAppointment,
				pauseDuration
			);
			return {
				...appointment,
				appointmentInfo: {
					...appointment.appointmentInfo,
					next: formatISO(updatedNextAppointment),
				},
			};
		});
	};

	const handleTooltipClick = () => {
		if (shouldProceed) {
			setOpenModal(true);
		} else {
			const endTime = Date.now();
			const pauseDuration = differenceInMilliseconds(
				new Date(endTime),
				new Date(startTime)
			);
			setFullPausedTime(fullPausedTime + pauseDuration);
			setShouldProceed(true);
			const updatedAppointments = updateAppointmentTimes(
				items,
				fullPausedTime + pauseDuration
			);
			setUpdatedItems(updatedAppointments);
		}
	};

	const filterItems = (now: string) => {
		const nowDate = parseISO(now);
		const startOfCurrentDay = startOfDay(nowDate);
		const endOfCurrentDay = endOfDay(nowDate);

		return updatedItems.filter(({ appointmentInfo }) => {
			const appointmentStart = parseISO(appointmentInfo.next);
			const appointmentEnd = addMinutes(
				appointmentStart,
				appointmentInfo.duration
			);
			const isCurrentDay = isWithinInterval(appointmentStart, {
				start: startOfCurrentDay,
				end: endOfCurrentDay,
			});

			return isCurrentDay
				? (isAfter(now, appointmentStart) && isBefore(now, appointmentEnd)) ||
            isAfter(appointmentStart, now)
				: null;
		});
	};

	const sortedItems = [...filterItems(nowDate)].sort(
		(a, b) =>
			new Date(a.appointmentInfo.next).getTime() -
      new Date(b.appointmentInfo.next).getTime()
	);

	const isSessionHappening = (
		nextAppointment: string,
		sessionDuration: number
	) => {
		const appointmentStart = parseISO(nextAppointment);
		const now = new Date();
		const appointmentEnd = addMinutes(appointmentStart, sessionDuration);

		const isHappening =
      isAfter(now, appointmentStart) && isBefore(now, appointmentEnd);

		return isHappening && !isPatientCard ? (
			<Timer>
				<Box width={'135px'} pr={1}>
					<Typography variant='caption'>session duration: </Typography>
				</Box>
				<Progress
					showLabel
					duration={sessionDuration}
					appointmentStart={nextAppointment}
					shouldProceed={shouldProceed}
				/>
				<Box>
					<Tooltip
						title={shouldProceed ? 'pause' : 'resume'}
						onClick={handleTooltipClick}
					>
						{shouldProceed ? <Pause /> : <Play />}
					</Tooltip>
				</Box>
			</Timer>
		) : null;
	};

	const handleProceed = () => {
		setStartTime(Date.now());
		setShouldProceed(false);
		setOpenModal(false);
	};

	useEffect(() => {
		intervalRef.current = window.setInterval(() => {
			const now = format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss');
			setUpdatedItems(filterItems(now));
		}, 1000);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [items, shouldProceed, fullPausedTime]);

	return (
		<Box p={5}>
			<DashboardCardWrapper>
				<DashboardCardTitle>
					<Typography variant='h5' fontWeight={600}>
						{t(titleKey)}
					</Typography>
					<Tooltip
						title={t(iconTitleKey)}
						onClick={() => navigate(navigateToURL)}
					>
						{icon}
					</Tooltip>
				</DashboardCardTitle>
				<Divider />
				<Box>
					{sortedItems.length === 0 ? (
						<>{isPatientCard ? <div>aaaaaa</div> : <div>bbbbb</div>}</>
					) : (
						<>
							{sortedItems.map(
								(
									{ firstName, lastName, appointmentInfo, patientId },
									index
								) => (
									<div
										key={`dashboard-card-${isPatientCard ? 'patient' : 'appointment'}-item-${index}`}
									>
										<DashboardCardItem
											appointmentInfo={appointmentInfo}
											firstName={firstName}
											lastName={lastName}
											patientId={patientId}
											isPatientCard={isPatientCard}
										/>
										<>
											{isSessionHappening(
												appointmentInfo.next,
												appointmentInfo.duration
											)}
										</>
									</div>
								)
							)}
						</>
					)}
				</Box>
			</DashboardCardWrapper>
			<Modal open={openModal}>
				<Box>
					<Card
						cardActionsProps={{
							actionName: 'Proceed',
							hasSecondAction: true,
							onClick: handleProceed,
							secondAction: () => setOpenModal(false),
							secondActionName: 'Cancel',
						}}
						cardTitleProps={{
							title: 'Pause Timer',
						}}
						cardTitle
					>
						<ModalPauseTimerContent>
							<Typography variant='subtitle1'>
                Pausing the timer will delay all your remaining appointments for
                today by the duration of this pause.
							</Typography>
							<Typography variant='subtitle1'>
                Are you sure you want to pause the timer?
							</Typography>
						</ModalPauseTimerContent>
					</Card>
				</Box>
			</Modal>
		</Box>
	);
};
