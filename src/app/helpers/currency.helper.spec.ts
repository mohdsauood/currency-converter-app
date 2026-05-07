import { mapSymbolsToCurrencies } from './currency.helper';

describe('mapSymbolsToCurrencies', () => {
  it('returns empty array for empty input', () => {
    expect(mapSymbolsToCurrencies({})).toEqual([]);
  });

  it('maps code and name correctly', () => {
    const result = mapSymbolsToCurrencies({ USD: 'US Dollar' });
    expect(result[0].code).toBe('USD');
    expect(result[0].name).toBe('US Dollar');
  });

  it('derives countryCode as first 2 chars of code lowercased', () => {
    const result = mapSymbolsToCurrencies({ USD: 'US Dollar' });
    expect(result[0].countryCode).toBe('us');
  });

  it('maps multiple currencies', () => {
    const result = mapSymbolsToCurrencies({ USD: 'US Dollar', EUR: 'Euro', GBP: 'Pound' });
    expect(result).toHaveLength(3);
  });
});
