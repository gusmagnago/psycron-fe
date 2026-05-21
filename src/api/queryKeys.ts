/**
 * Canonical React Query key factory.
 *
 * Rules:
 * - Always use these instead of inline string arrays.
 * - Prefix-only keys (no args) act as wildcard invalidators:
 *   invalidateQueries({ queryKey: QUERY_KEYS.patientDetails() }) clears ALL patient detail caches.
 * - Keys with IDs target a specific resource.
 */

export const QUERY_KEYS = {
	// Auth / session
	session: () => ['session'] as const,

	// User
	userDetails: (userId?: string) =>
		userId ? (['userDetails', userId] as const) : (['userDetails'] as const),

	// Availability
	// Pass therapistId in useQuery calls; omit for prefix-wildcard invalidation
	therapistAvailability: (therapistId?: string) =>
		therapistId
			? (['therapistAvailability', therapistId] as const)
			: (['therapistAvailability'] as const),
	// Pass dayId in useQuery calls; omit for prefix-wildcard invalidation
	availabilityByDay: (dayId?: string) =>
		dayId
			? (['availabilityByDay', dayId] as const)
			: (['availabilityByDay'] as const),
	jupiterAvailability: () => ['jupiterAvailability'] as const,

	// Public booking (unauthenticated)
	publicAvailability: (therapistId: string) =>
		['publicAvailability', therapistId] as const,
	publicTherapist: (therapistId: string) =>
		['publicTherapist', therapistId] as const,
	publicPatientSessions: (patientId: string) =>
		['publicPatientSessions', patientId] as const,

	// Patients
	patientList: () => ['patientList'] as const,
	patientDetails: (patientId?: string) =>
		patientId
			? (['patientDetails', patientId] as const)
			: (['patientDetails'] as const),
	patientListItem: (therapistId?: string, patientId?: string) =>
		therapistId && patientId
			? (['patientListItem', therapistId, patientId] as const)
			: (['patientListItem'] as const),

	// Appointments / slots
	slotAppointmentDetails: (slotId: string) =>
		['slotAppointmentDetails', slotId] as const,
	appointmentDetailsBySlotId: () =>
		['getAppointmentDetailsBySlotId'] as const,
	publicSlotDetails: (slotId: string) =>
		['getPublicSlotDetailsById', slotId] as const,

	// Worker
	workerMe: () => ['worker-me'] as const,

	// Conflicts
	conflicts: (therapistId: string) => ['conflicts', therapistId] as const,
	conflictCount: (therapistId: string) =>
		['conflictCount', therapistId] as const,

	// Notifications
	notifications: () => ['notifications'] as const,

	// Cancellation recovery
	cancellationRecovery: (therapistId: string) =>
		['cancellationRecovery', therapistId] as const,
} as const;
