import { getHealthStatus } from '../src/health';

describe('getHealthStatus', () => {
  it('returns status ok', () => {
    expect(getHealthStatus()).toEqual({ status: 'ok' });
  });
});
