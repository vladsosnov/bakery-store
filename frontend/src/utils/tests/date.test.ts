import { formatOrderDate } from '../date';

describe('date utils', () => {
  it('returns fallback for null date', () => {
    expect(formatOrderDate(null)).toBe('Unknown date');
  });

  it('returns fallback for invalid date string', () => {
    expect(formatOrderDate('not-a-date')).toBe('Unknown date');
  });

  it('formats valid date using locale string', () => {
    const toLocaleStringSpy = jest
      .spyOn(Date.prototype, 'toLocaleString')
      .mockReturnValue('formatted date');

    expect(formatOrderDate('2026-03-06T10:00:00.000Z')).toBe('formatted date');

    toLocaleStringSpy.mockRestore();
  });
});
