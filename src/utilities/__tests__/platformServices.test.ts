import { useAuthenticateUser, useEnvironment, useUserRbacPermissions } from '../platformServices';

describe('Authenticate User method', () => {
  it('should return a promise with user data', async () => {
    const user = await useAuthenticateUser();
    expect(user.identity.user.email).toEqual('john.doe@redhat.com');
  });

  it('should throw an error if rejected', () => {
    jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
      __esModule: true,
      default: () => ({
        getUser: () => {
          throw new Error('Error getting user');
        }
      })
    }));

    try {
      useAuthenticateUser();
    } catch (e) {
      expect(e.message).toEqual('Error authenticating user: Error getting user');
    }
  });
});

describe('getUserRbacPermissions', () => {
  it('should return a promise with user RBAC permissions', () => {
    expect(useUserRbacPermissions()).resolves.toEqual([
      { resourceDefinitions: [], permission: 'subscriptions:products:read' }
    ]);
  });

  it('should throw an error if rejected', () => {
    jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
      __esModule: true,
      default: () => ({
        getUserPermissions: () => 'Nope'
      })
    }));

    try {
      useAuthenticateUser();
    } catch (e) {
      expect(e.message).toEqual('Error getting user permissions: Nope');
    }
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
