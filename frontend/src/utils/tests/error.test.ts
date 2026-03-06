import { toErrorMessage } from '../error';

describe('error utils', () => {
  it('returns backend error message for axios-like error', () => {
    const error = {
      isAxiosError: true,
      response: {
        data: {
          error: 'Backend failed'
        }
      }
    };

    expect(toErrorMessage(error, 'Fallback')).toBe('Backend failed');
  });

  it('returns fallback when axios-like error does not include backend message', () => {
    const error = {
      isAxiosError: true,
      response: {
        data: {}
      }
    };

    expect(toErrorMessage(error, 'Fallback')).toBe('Fallback');
  });

  it('returns fallback for non-axios error', () => {
    expect(toErrorMessage(new Error('Oops'), 'Fallback')).toBe('Fallback');
  });
});
