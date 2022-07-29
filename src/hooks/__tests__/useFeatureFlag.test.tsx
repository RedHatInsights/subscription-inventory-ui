import useFeatureFlag from '../useFeatureFlag';
import { useFlag, useFlagsStatus } from '@unleash/proxy-client-react';

jest.mock('@unleash/proxy-client-react', () => ({
  useFlag: jest.fn(),
  useFlagsStatus: jest.fn()
}));

describe('useFeatureFlag', () => {
  it('returns true when true', () => {
    (useFlag as jest.Mock).mockImplementation(() => true);
    (useFlagsStatus as jest.Mock).mockImplementation(() => ({ flagsReady: true }));
    expect(useFeatureFlag('anything')).toBe(true);
  });
  it('returns false when false', () => {
    (useFlag as jest.Mock).mockImplementation(() => false);
    (useFlagsStatus as jest.Mock).mockImplementation(() => ({ flagsReady: true }));
    expect(useFeatureFlag('anything')).toBe(false);
  });
  it('returns false when not ready', () => {
    (useFlag as jest.Mock).mockImplementation(() => true);
    (useFlagsStatus as jest.Mock).mockImplementation(() => ({ flagsReady: false }));
    expect(useFeatureFlag('anything')).toBe(false);
  });
});
