import { renderHook, waitFor } from '@testing-library/react';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';
import { authenticateUser, getUserRbacPermissions } from '../../utilities/platformServices';
import useUser from '../useUser';
import { createQueryWrapper } from '../../utilities/testHelpers';

enableFetchMocks();

beforeEach(() => {
  fetch.resetMocks();
});

jest.mock('../../utilities/platformServices', () => ({
  ...(jest.requireActual('../../utilities/platformServices') as Record<string, unknown>),
  authenticateUser: jest.fn(),
  getUserRbacPermissions: jest.fn()
}));

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  __esModule: true,
  default: () => ({})
}));

describe('useUser hook', () => {
  it('gets the user permissions back from two API calls', async () => {
    (authenticateUser as jest.Mock).mockResolvedValue({
      identity: {
        user: {
          is_org_admin: true
        }
      }
    });

    const mockSCAStatusResponse = {
      body: {
        id: '123456',
        simpleContentAccess: 'enabled',
        simpleContentAccessCapable: true
      }
    };

    (getUserRbacPermissions as jest.Mock).mockResolvedValue([
      { permission: 'subscriptions:products:read' }
    ]);

    fetch.mockResponseOnce(JSON.stringify(mockSCAStatusResponse));

    const { result } = renderHook(() => useUser(), {
      wrapper: createQueryWrapper()
    });

    await waitFor(() =>
      expect(result.current.data).toEqual({
        canReadProducts: true,
        isOrgAdmin: true
      })
    );
  });

  it('does not return anything if the Authenticate User API call fails', async () => {
    const originalError = console.error;
    console.error = jest.fn();
    const mockSCAStatusResponse = {
      body: {
        id: '123456',
        simpleContentAccess: 'enabled',
        simpleContentAccessCapable: true
      }
    };
    fetch.mockResponseOnce(JSON.stringify(mockSCAStatusResponse));

    (authenticateUser as jest.Mock).mockImplementation(async () => {
      await new Promise((res) => setTimeout(res, 5));
      throw new Error('error');
    });

    const { result } = renderHook(() => useUser(), {
      wrapper: createQueryWrapper()
    });

    await waitFor(() => result.current.isError);

    expect(result.current.data).toEqual(undefined);
    console.error = originalError;
  });
});
