import { CurrencyCode } from './currency.model';

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
