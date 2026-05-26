import { authenticateUser, getUserRbacPermissions, useEnvironment } from '../platformServices';
import { ChromeAPI } from '@redhat-cloud-services/types';

jest.mock('@redhat-cloud-services/frontend-components/useChrome');

describe('Authenticate User method', () => {
  it('should return a promise with user data', async () => {
    const mockChrome = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          identity: {
            user: { email: 'john.doe@redhat.com' }
          },
          entitlements: {}
        })
      }
    } as unknown as ChromeAPI;

    const user = await authenticateUser(mockChrome);
    expect(user.identity.user.email).toEqual('john.doe@redhat.com');
  });

  it('should throw an error if rejected', async () => {
    const mockChrome = {
      auth: {
        getUser: jest.fn().mockRejectedValue(new Error('Error getting user'))
      }
    } as unknown as ChromeAPI;

    await expect(authenticateUser(mockChrome)).rejects.toThrow(
      'Error authenticating user: Error getting user'
    );
  });
});

describe('getUserRbacPermissions', () => {
  it('should return a promise with user RBAC permissions', () => {
    const mockChrome = {
      getUserPermissions: jest
        .fn()
        .mockResolvedValue([{ resourceDefinitions: [], permission: 'subscriptions:products:read' }])
    } as unknown as ChromeAPI;

    expect(getUserRbacPermissions(mockChrome)).resolves.toEqual([
      { resourceDefinitions: [], permission: 'subscriptions:products:read' }
    ]);
  });
});

describe('getEnvironment', () => {
  it('returns the environment', () => {
    expect(useEnvironment()).toEqual('qa');
  });

  it('returns "ci" if environment is not specified', () => {
    jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
      __esModule: true,
      default: () => ({
        getEnvironment: () => {
          return;
        }
      })
    }));
    expect(useEnvironment()).toEqual('ci');
  });
});
