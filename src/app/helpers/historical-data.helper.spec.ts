import { getLastTwelveMonthsData } from './historical-data.helper';

describe('getLastTwelveMonthsData', () => {
  it('returns exactly 12 months', () => {
    const { months } = getLastTwelveMonthsData();
    expect(months).toHaveLength(12);
  });

  it('returns exactly 12 dates', () => {
    const { dates } = getLastTwelveMonthsData();
    expect(dates).toHaveLength(12);
  });

  it('each date matches YYYY-MM-DD format', () => {
    const { dates } = getLastTwelveMonthsData();
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    dates.forEach(date => expect(date).toMatch(datePattern));
  });

  it('each month label is a valid short month name', () => {
    const validMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const { months } = getLastTwelveMonthsData();
    months.forEach(m => expect(validMonths).toContain(m));
  });
});
