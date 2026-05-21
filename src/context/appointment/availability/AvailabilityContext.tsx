import { createContext, useMemo } from 'react';
import { useContext } from 'react';
import type { CustomError } from '@psycron/api/error';
import { QUERY_KEYS } from '@psycron/api/queryKeys';
import { getTherapistLatestAvailability } from '@psycron/api/user';
import { getAvailabilityByDayId } from '@psycron/api/user';
import {
	cancelAppointmentByPatient,
	editSlotStatus,
	getAppointmentDetailsBySlotId,
	getPublicSlotDetailsById,
} from '@psycron/api/user/availability';
import type {
	CancelAppointmentPayload,
	IEditSlotStatus,
	StatusEnum,
} from '@psycron/api/user/availability/index.types';
import type {
	IDateInfo,
	IPaginatedAvailability,
} from '@psycron/api/user/index.types';
import { useAlert } from '@psycron/context/alert/AlertContext';
import { useTherapistId } from '@psycron/hooks/useTherapistId';
import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';

import type {
	AvailabilityContextType,
	AvailabilityProviderProps,
} from './AvailabilityContext.types';

const AvailabilityContext = createContext<AvailabilityContextType | undefined>(
	undefined
);

export const AvailabilityProvider = ({
	children,
}: AvailabilityProviderProps) => {
	const therapistId = useTherapistId();

	const { data, isLoading } = useQuery({
		queryKey: QUERY_KEYS.therapistAvailability(therapistId),
		queryFn: async () => getTherapistLatestAvailability(therapistId),
		enabled: !!therapistId,
		staleTime: 1000 * 60 * 5,
	});

	const pageStatus = useMemo(() => {
		if (!data?.dates.length) return null;

		return {
			firstDate: data?.dates.at(0),
			latestDate: data?.dates.at(-1),
		};
	}, [data?.dates]);

	return (
		<AvailabilityContext.Provider
			value={{
				availabilityData: data,
				availabilityDataIsLoading: isLoading,
				firstDate: pageStatus?.firstDate,
				lastDate: pageStatus?.latestDate,
				totalPages: data?.totalPages,
			}}
		>
			{children}
		</AvailabilityContext.Provider>
	);
};

export const useAvailability = (
	initialDaySelected?: IDateInfo,
	availabilityDayId?: string | null,
	slotId?: string | null,
	patientId?: string
) => {
	const context = useContext(AvailabilityContext);
	if (!context) {
		throw new Error(
			'useAvailability must be used within an AvailabilityProvider'
		);
	}

	const queryClient = useQueryClient();
	const { showAlert } = useAlert();

	const therapistId = useTherapistId();

	const {
		data: dataFromSelectedDayRes,
		isLoading: isDataFromSelectedDayLoading,
		fetchNextPage,
		fetchPreviousPage,
		isFetchingNextPage,
		isFetchingPreviousPage,
		hasNextPage,
		hasPreviousPage,
	} = useInfiniteQuery({
		queryKey: QUERY_KEYS.availabilityByDay(initialDaySelected?.dateId),
		queryFn: async ({ pageParam }) => {
			return getAvailabilityByDayId(therapistId, {
				dateId: initialDaySelected?.dateId,
				cursor: pageParam,
			});
		},
		enabled: !!therapistId && !!initialDaySelected?.dateId,
		initialPageParam: null,
		getPreviousPageParam: (firstPage) => {
			return firstPage.pagination?.previousCursor;
		},
		getNextPageParam: (lastPage) => lastPage.pagination?.nextCursor,
		placeholderData: (prev) => prev,
		staleTime: 1000 * 60 * 5,
	});

	const firstPage = dataFromSelectedDayRes?.pages?.[0];
	const latestPage = dataFromSelectedDayRes?.pages?.at(-1);

	const lastAvailableItem = latestPage?.availabilityDates?.at(-1);
	const lastAvailableDate = lastAvailableItem?.date ?? null;
	const lastAvailableDateIdFromPagination =
		lastAvailableItem?._id?.toString() ?? null;

	const consultationDuration = firstPage?.consultationDuration;

	const {
		data: appointmentDetailsBySlotId,
		isLoading: isAppointmentDetailsBySlotIdLoading,
	} = useQuery({
		queryFn: () =>
			getAppointmentDetailsBySlotId(therapistId, availabilityDayId, slotId),
		enabled: !!therapistId && !!slotId && !!patientId,
		queryKey: QUERY_KEYS.slotAppointmentDetails(slotId),
		staleTime: 1000 * 60 * 5,
	});

	const editSlotStatusMutation = useMutation({
		mutationFn: editSlotStatus,
		onSuccess: (data, variables) => {
			showAlert({
				message: data.message,
				severity: 'success',
			});

			queryClient.setQueryData<IPaginatedAvailability>(
				['availabilityByDay'],
				(oldData) => {
					if (!oldData) return oldData;

					return {
						...oldData,
						availabilityDates: oldData.availabilityDates.map((date) =>
							date._id === variables.availabilityDayId
								? {
										...date,
										slots: date.slots.map((slot) =>
											slot._id === variables.slotId
												? {
														...slot,
														status: variables.data.newStatus as StatusEnum,
													}
												: slot
										),
									}
								: date
						),
						pagination: oldData.pagination,
						therapistId: oldData.therapistId,
						timezone: oldData.timezone,
					};
				}
			);
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.availabilityByDay() });
		},
		onError: (error: CustomError) => {
			showAlert({
				message: error.message,
				severity: 'error',
			});
		},
	});

	const editSlotStatusMttn = (data: IEditSlotStatus) => {
		editSlotStatusMutation.mutate(data);
	};

	const { data: publicSlotDetails, isLoading: publicSlotDetailsIsLoading } =
		useQuery({
			queryKey: QUERY_KEYS.publicSlotDetails(slotId),
			queryFn: () => getPublicSlotDetailsById(therapistId, slotId),
			enabled: !!therapistId && !!slotId,
			retry: false,
			staleTime: 1000 * 60 * 5,
		});

	const cancelAppointmentMutation = useMutation({
		mutationFn: cancelAppointmentByPatient,
		onSuccess: (data) => {
			showAlert({
				message: data.message,
				severity: 'success',
			});
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.availabilityByDay() });
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.patientDetails(patientId),
			});
		},
		onError: (error: CustomError) => {
			showAlert({
				message: error.message,
				severity: 'error',
			});
		},
	});

	const cancelAppointment = (payload: CancelAppointmentPayload) => {
		cancelAppointmentMutation.mutate(payload);
	};

	return {
		...context,
		dataFromSelectedDayRes,
		consultationDuration,
		isDataFromSelectedDayLoading,
		hasNextPage,
		hasPreviousPage,
		fetchNextPage,
		fetchPreviousPage,
		lastAvailableDate,
		lastAvailableDateIdFromPagination,
		appointmentDetailsBySlotId,
		isAppointmentDetailsBySlotIdLoading,
		isFetchingNextPage,
		isFetchingPreviousPage,
		editSlotStatusMttn,
		publicSlotDetails,
		publicSlotDetailsIsLoading,
		cancelAppointment,
		cancelAppointmentIsLoading: cancelAppointmentMutation.isPending,
		cancelAppointmentSuccess: cancelAppointmentMutation.isSuccess,
	};
};
