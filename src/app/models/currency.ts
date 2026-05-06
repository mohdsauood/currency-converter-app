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
}

export interface FixerError {
    code: number;
    type: string;
    info: string;
}

export interface SymbolsResponse {
    success: boolean;
    symbols: Record<CurrencyCode, string>;
    error?: FixerError;
}

export interface RatesResponse {
    success: boolean;
    timestamp: number;
    base: CurrencyCode;
    date: string;
    rates: Record<CurrencyCode, number>;
    error?: FixerError;
}

export interface PopularCurrencyCard extends Currency {
    convertedAmount: number | null;
}
