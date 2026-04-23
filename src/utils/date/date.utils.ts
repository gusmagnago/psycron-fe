import type { Locale } from 'date-fns';
import { format } from 'date-fns';
import { enUS, ptBR } from 'date-fns/locale';

export const getDateLocale = (language: string): Locale =>
	language.startsWith('pt') ? ptBR : enUS;

export const capitalizeDateLabel = (value: string): string =>
	value ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : value;

export const formatLocalizedDate = (
	value: Date | string | null | undefined,
	fallback: string,
	language: string,
	pattern = 'PPP'
): string => {
	if (!value) return fallback;

	return capitalizeDateLabel(
		format(new Date(value), pattern, {
			locale: getDateLocale(language),
		})
	);
};

export const formatDateTimeRange = (
	value: Date,
	startTime: string,
	endTime: string,
	language: string
): string =>
	`${format(value, 'PPP', { locale: getDateLocale(language) })} · ${startTime} - ${endTime}`;

export const formatTimezoneLabel = (
	timeZone: string | undefined,
	language: string,
	fallback: string
): string => {
	if (!timeZone) return fallback;

	try {
		const formatter = new Intl.DateTimeFormat(
			language.startsWith('pt') ? 'pt-BR' : 'en-US',
			{
				timeZone,
				timeZoneName: 'longGeneric',
			}
		);
		const part = formatter
			.formatToParts(new Date())
			.find((item) => item.type === 'timeZoneName')?.value;

		return part || timeZone.replaceAll('_', ' ');
	} catch {
		return timeZone.replaceAll('_', ' ');
	}
};
