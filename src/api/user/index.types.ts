import type {
	ISlot,
	ISODateString,
	ITherapist,
} from '@psycron/context/user/auth/UserAuthenticationContext.types';

/**
 * Shared API response helpers
 */
export interface IResponse {
	message: string;
	status: string;
}

/**
 * GET /users/:id
 */
export interface IUserByIdResponse {
	user: ITherapist;
}

/**
 * POST /users/edit/:id
 */
export interface IEditUser {
	data: Partial<ITherapist>;
	userId: string;
}

/**
 * POST /users/password-change/:id
 *
 * NOTE: Your BE expects: currentPassword/newPassword/confirmPassword
 * Your old type used "password" — rename to match BE.
 */
export interface IPasswordChangePayload {
	confirmPassword: string;
	currentPassword: string;
	newPassword: string;
}

export interface IChangePass {
	data: IPasswordChangePayload;
	userId: string;
}

/**
 * Availability endpoints
 *
 * GET /users/:therapistId/availability?latest=true
 *
 * Your response:
 * {
 *   dates: [{ _id, date, slots }],
 *   firstDate, lastDate, isEmpty, totalPages
 * }
 */
export interface IDateInfo {
	date: ISODateString;
	dateId?: string;
}

export interface IAvailabilityDate {
	_id: string;
	date: ISODateString;
	slots: ISlot[];
}

export interface IAvailabilityDateRef {
	date: ISODateString;
	dateId: string;
	slots?: ISlot[];
}

export interface IOccupancyCount {
	available: number;
	booked: number;
}

export interface ICalendarDay {
	date: string;
	google: IOccupancyCount;
	jupiter: IOccupancyCount;
}

export interface IAvailabilityResponse {
	calendar?: ICalendarDay[];
	dates: IAvailabilityDateRef[];
	firstDate: IDateInfo | null;
	// Therapist's Google calendar color, co-located with the slots so Google
	// events without a per-event colorId resolve their fill in this same
	// response — avoids the flash from default blue while a slower config
	// query resolves.
	googleCalendarColor?: string | null;
	isEmpty: boolean;
	lastDate: IDateInfo | null;
	timezone?: string;
	totalPages: number;
}

/**
 * GET /users/:therapistId/availability/by-day?dayId=...&cursor=...
 */
export interface DateInfoParams {
	cursor?: string;
	dateId: string;
}

/**
 * Pagination shape from BE.
 */
export interface IPagination {
	hasNextPage: boolean;
	hasPrevPage: boolean;
	nextCursor: string | null;
	previousCursor: string | null;
	totalItems: number;
}

export interface IPaginatedAvailability {
	availabilityDates: IAvailabilityDate[];
	// if conflicts are implemented, type properly later
	conflicts?: unknown[];

	consultationDuration?: number;

	pagination: IPagination;
	therapistId: string;

	timezone?: string;
}
