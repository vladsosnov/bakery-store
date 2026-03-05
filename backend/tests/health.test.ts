import { getHealthStatus } from '../src/health.js';

describe('getHealthStatus', () => {
  it('returns status ok', () => {
    expect(getHealthStatus()).toEqual({ status: 'ok' });
  });
});
