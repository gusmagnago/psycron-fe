import type {
	ISlot,
	ISODateString,
	ITherapist,
	MongoId,
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
	userId: MongoId;
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
	userId: MongoId;
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
	dateId?: MongoId;
}

export interface IAvailabilityDate {
	_id: MongoId;
	date: ISODateString;
	slots: ISlot[];
}

export interface IAvailabilityDateRef {
	date: ISODateString;
	dateId: MongoId;
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
	isEmpty: boolean;
	lastDate: IDateInfo | null;
	totalPages: number;
}

/**
 * GET /users/:therapistId/availability/by-day?dayId=...&cursor=...
 */
export interface DateInfoParams {
	cursor?: string;
	dateId: MongoId;
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
	therapistId: MongoId;

	timezone?: string;
}
