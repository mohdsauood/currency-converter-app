import { Currency } from '../models/currency.model';

export function mapSymbolsToCurrencies(symbols: Record<string, string>): Currency[] {
    return Object.entries(symbols).map(([code, name]) => ({
        code,
        name,
        countryCode: code.slice(0, 2).toLowerCase(),
    }));
}
