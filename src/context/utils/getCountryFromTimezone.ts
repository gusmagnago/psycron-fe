import type { Country } from 'react-phone-number-input';

const TIMEZONE_TO_COUNTRY: Record<string, Country> = {
	// Brazil
	'America/Araguaina': 'BR',
	'America/Bahia': 'BR',
	'America/Belem': 'BR',
	'America/Boa_Vista': 'BR',
	'America/Campo_Grande': 'BR',
	'America/Cuiaba': 'BR',
	'America/Eirunepe': 'BR',
	'America/Fortaleza': 'BR',
	'America/Maceio': 'BR',
	'America/Manaus': 'BR',
	'America/Noronha': 'BR',
	'America/Porto_Velho': 'BR',
	'America/Recife': 'BR',
	'America/Rio_Branco': 'BR',
	'America/Santarem': 'BR',
	'America/Sao_Paulo': 'BR',
	// Austria
	'Europe/Vienna': 'AT',
	// Belgium
	'Europe/Brussels': 'BE',
	// Bulgaria
	'Europe/Sofia': 'BG',
	// Croatia
	'Europe/Zagreb': 'HR',
	// Cyprus
	'Asia/Famagusta': 'CY',
	'Asia/Nicosia': 'CY',
	// Czech Republic
	'Europe/Prague': 'CZ',
	// Denmark
	'Europe/Copenhagen': 'DK',
	// Estonia
	'Europe/Tallinn': 'EE',
	// Finland
	'Europe/Helsinki': 'FI',
	// France
	'Europe/Paris': 'FR',
	// Germany
	'Europe/Berlin': 'DE',
	'Europe/Busingen': 'DE',
	// Greece
	'Europe/Athens': 'GR',
	// Hungary
	'Europe/Budapest': 'HU',
	// Ireland
	'Europe/Dublin': 'IE',
	// Italy
	'Europe/Rome': 'IT',
	// Latvia
	'Europe/Riga': 'LV',
	// Lithuania
	'Europe/Vilnius': 'LT',
	// Luxembourg
	'Europe/Luxembourg': 'LU',
	// Malta
	'Europe/Malta': 'MT',
	// Netherlands
	'Europe/Amsterdam': 'NL',
	// Poland
	'Europe/Warsaw': 'PL',
	// Portugal
	'Atlantic/Azores': 'PT',
	'Atlantic/Madeira': 'PT',
	'Europe/Lisbon': 'PT',
	// Romania
	'Europe/Bucharest': 'RO',
	// Slovakia
	'Europe/Bratislava': 'SK',
	// Slovenia
	'Europe/Ljubljana': 'SI',
	// Spain
	'Africa/Ceuta': 'ES',
	'Atlantic/Canary': 'ES',
	'Europe/Madrid': 'ES',
	// Sweden
	'Europe/Stockholm': 'SE',
};

export const getCountryFromTimezone = (): Country | null => {
	try {
		const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
		return TIMEZONE_TO_COUNTRY[tz] ?? null;
	} catch {
		return null;
	}
};
