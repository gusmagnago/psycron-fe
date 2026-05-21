import type { IAvailabilityResponse } from '../../src/api/user/index.types';
import type { ITherapist } from '../../src/context/user/auth/UserAuthenticationContext.types';

export const THERAPIST_ID = 'therapist-001';
export const PATIENT_ID = 'patient-001';
export const SLOT_ID = 'slot-001';
export const DAY_ID = 'day-001';

// A date well in the future so tests don't rot
export const FUTURE_DATE = '2027-06-02';
export const FUTURE_DATE_ISO = `${FUTURE_DATE}T00:00:00.000Z`;

export const mockTherapist: ITherapist = {
	_id: THERAPIST_ID,
	firstName: 'Ana',
	lastName: 'Costa',
	contacts: { email: 'ana@clinic.com' },
	role: 'THERAPIST',
	availability: [],
	notifications: [],
	patients: [PATIENT_ID],
	timeZone: 'America/Sao_Paulo',
	google: {
		email: '',
		familyName: '',
		givenName: '',
		id: '',
		name: '',
		picture: '',
		updatedAt: new Date('2025-01-01'),
	},
};

export const mockPatient = {
	_id: PATIENT_ID,
	firstName: 'João',
	lastName: 'Santos',
	contacts: { email: 'joao@example.com', phone: '+5511999999999' },
	role: 'PATIENT' as const,
	sessionDates: [],
	cancelledAppointments: [],
	status: 'ACTIVE',
};

// Wrapped shape for endpoints that return { patient: ... }
export const mockPatientApiResponse = { patient: mockPatient };

export const mockAvailability: IAvailabilityResponse = {
	dates: [
		{
			date: FUTURE_DATE_ISO,
			dateId: DAY_ID,
			slots: [
				{
					_id: SLOT_ID,
					startTime: '09:00',
					endTime: '10:00',
					status: 'AVAILABLE',
					deliveryMode: 'online',
				},
				{
					_id: 'slot-002',
					startTime: '10:00',
					endTime: '11:00',
					status: 'AVAILABLE',
					deliveryMode: 'online',
				},
			],
		},
	],
	firstDate: { date: FUTURE_DATE_ISO, dateId: DAY_ID },
	lastDate: null,
	isEmpty: false,
	totalPages: 1,
};

export const mockBookingResponse = {
	message: 'Appointment booked successfully',
	patient: {
		_id: PATIENT_ID,
		firstName: 'João',
		lastName: 'Santos',
	},
};

// Shape for GET /:patientId/sessions (public patient sessions endpoint)
export const mockPublicPatientSessions = {
	status: 'ok',
	patient: {
		_id: PATIENT_ID,
		firstName: 'João',
		lastName: 'Santos',
		therapistId: THERAPIST_ID,
		sessionDates: [
			{
				_id: 'session-day-001',
				date: FUTURE_DATE_ISO,
				slots: [
					{
						_id: 'slot-booked-001',
						startTime: '09:00',
						endTime: '10:00',
						status: 'BOOKED',
						deliveryMode: 'online',
					},
				],
			},
		],
		cancelledAppointments: [],
	},
};
