export type CountryDataFull = {
  countryCode2?: string;
  countryCode3?: string;
  countryEmoji?: string;
  countryFlag?: string;
  countryName?: string;
  currency?: {
    code: string;
    name: string;
    symbol: string;
  };
  ip: string;
  languages: string;
  timeZone: { currentTime: string; name: string };
} & CountryDataSimple;

export interface CountryDataSimple {
  callingCode: string | null;
  countryEmoji?: string;
}

export interface UserGeoLocationContextType {
  countryData: CountryDataFull | CountryDataSimple;
}
