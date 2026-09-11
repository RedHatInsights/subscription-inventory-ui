import { renderHook, waitFor } from '@testing-library/react';
import useAccountNumber from '../useAccountNumber';
import { createQueryWrapper } from '../../utilities/testHelpers';

const mockGetUser = jest.fn();

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  __esModule: true,
  default: () => ({ auth: { getUser: mockGetUser } })
}));

describe('useAccountNumber hook', () => {
  it('returns the account number from the chrome identity', async () => {
    mockGetUser.mockResolvedValue({ identity: { account_number: '8675309' } });

    const { result } = renderHook(() => useAccountNumber(), {
      wrapper: createQueryWrapper()
    });

    await waitFor(() => expect(result.current.data).toEqual('8675309'));
  });

  it('returns null when the identity has no account number', async () => {
    mockGetUser.mockResolvedValue({ identity: {} });

    const { result } = renderHook(() => useAccountNumber(), {
      wrapper: createQueryWrapper()
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });

  it('returns null when chrome has no user', async () => {
    mockGetUser.mockResolvedValue(undefined);

    const { result } = renderHook(() => useAccountNumber(), {
      wrapper: createQueryWrapper()
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });

  it('does not return anything when the chrome call fails', async () => {
    const originalError = console.error;
    console.error = jest.fn();

    mockGetUser.mockRejectedValue(new Error('Error getting user'));

    const { result } = renderHook(() => useAccountNumber(), {
      wrapper: createQueryWrapper()
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();

    console.error = originalError;
  });
});
