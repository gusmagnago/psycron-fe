import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cancelAppointment, editAppointment } from '@psycron/api/appointment';
import type {
	ICancelAppointment,
	IEditAppointment,
} from '@psycron/api/appointment/index.types';
import type { CustomError } from '@psycron/api/error';
import { QUERY_KEYS } from '@psycron/api/queryKeys';
import { useAlert } from '@psycron/context/alert/AlertContext';
import type { ISessionDate } from '@psycron/context/user/auth/UserAuthenticationContext.types';
import i18n from '@psycron/i18n';
import { APPOINTMENTS } from '@psycron/pages/urls';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type {
	AppointmentActionsProviderProps,
	IAppointmentActionsContext,
} from './AppointmentActionsContext.types';

const AppointmentActionsContext = createContext<
	IAppointmentActionsContext | undefined
>(undefined);

export const AppointmentActionsProvider = ({
	children,
}: AppointmentActionsProviderProps) => {
	const [openEditModal, setOpenEditModal] = useState(false);
	const [openCancelModal, setOpenCancelModal] = useState(false);
	const [selectedSession, setSelectedSession] = useState(null);

	const navigate = useNavigate();

	const { showAlert } = useAlert();

	const queryClient = useQueryClient();

	const handleEditClick = (session: ISessionDate) => {
		setSelectedSession(session);
		setOpenEditModal(true);
	};

	const handleCancelClick = (session: ISessionDate) => {
		setSelectedSession(session);
		setOpenCancelModal(true);
	};

	const closeModals = () => {
		setOpenEditModal(false);
		setOpenCancelModal(false);
		setSelectedSession(null);
	};

	const cancelAppointmentMutation = useMutation({
		mutationFn: cancelAppointment,
		onSuccess: (data) => {
			showAlert({
				severity: 'success',
				message: data.message,
			});

			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.therapistAvailability() });
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userDetails() });
			queryClient
				.refetchQueries({ queryKey: QUERY_KEYS.therapistAvailability() })
				.then(() => {
					navigate(`/${i18n.language}/${APPOINTMENTS}`);
				});
		},
		onError: (error: CustomError) => {
			showAlert({
				severity: 'error',
				message: error.message,
			});
		},
	});

	const cancelAppointmentMttn = (data: ICancelAppointment) => {
		cancelAppointmentMutation.mutate(data);
	};

	const editAppointmentMutation = useMutation({
		mutationFn: editAppointment,
		onSuccess: (data) => {
			showAlert({
				severity: 'success',
				message: data.message,
			});
			queryClient.invalidateQueries({ queryKey: ['userDetails'] });
			queryClient.invalidateQueries({ queryKey: ['therapistAvailability'] });
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.appointmentDetailsBySlotId(),
			});

			queryClient
				.refetchQueries({ queryKey: ['therapistAvailability'] })
				.then(() => {
					navigate(`/${i18n.language}/${APPOINTMENTS}`);
				});
		},
		onError: (error: CustomError) => {
			showAlert({
				severity: 'error',
				message: error.message,
			});
		},
	});

	const editAppointmentMttn = (data: IEditAppointment) => {
		editAppointmentMutation.mutate(data);
	};

	return (
		<AppointmentActionsContext.Provider
			value={{
				openEditModal,
				openCancelModal,
				selectedSession,
				handleEditClick,
				handleCancelClick,
				closeModals,
				cancelAppointmentMttn,
				editAppointmentMttn,
				isEditAppointmentLoading: editAppointmentMutation.isPending,
				isCancelAppointmentLoading: cancelAppointmentMutation.isPending,
			}}
		>
			{children}
		</AppointmentActionsContext.Provider>
	);
};

export const useAppointmentActions = (): IAppointmentActionsContext => {
	const context = useContext(AppointmentActionsContext);
	if (!context) {
		throw new Error(
			'useAppointmentActions deve ser usado dentro de um AppointmentActionsProvider'
		);
	}

	return context;
};
