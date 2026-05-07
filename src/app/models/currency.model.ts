import { MOCK_SYMBOLS_RESPONSE } from '../mock-data/mock-symbols';

export type CurrencyCode = keyof typeof MOCK_SYMBOLS_RESPONSE.symbols;

export interface Currency {
    code: string;
    name: string;
    countryCode: string;
}

export interface ConversionState {
    amount: number;
    fromCurrency: CurrencyCode;
    toCurrency?: CurrencyCode;
}

export interface ChartDataPoint {
    month: string;
    date: string;
    rate: number;
}

export interface PopularCurrencyCard extends Currency {
    convertedAmount: number | null;
}
