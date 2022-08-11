import { useQuery, UseQueryResult } from 'react-query';
import Cookies from 'js-cookie';
import { getConfig, authenticateUser, getUserRbacPermissions } from '../utilities/platformServices';

interface User {
  accountNumber: string;
  canReadProducts: boolean;
  isOrgAdmin: boolean;
}

const getUser = (): Promise<User> => {
  return Promise.all([authenticateUser(), getUserRbacPermissions()]).then(
    ([userStatus, rawRbacPermissions]) => {
      const rbacPermissions = rawRbacPermissions.map((rawPermission) => rawPermission.permission);
      const user: User = {
        accountNumber: userStatus.identity.account_number,
        canReadProducts:
          rbacPermissions.includes('subscriptions:products:read') ||
          rbacPermissions.includes('subscriptions:*:*'),
        isOrgAdmin: userStatus.identity.user.is_org_admin === true
      };
      return user;
    }
  );
};

const useUser = (): UseQueryResult<User, unknown> => {
  return useQuery('user', () => getUser());
};

export { getUser, useUser as default, User };
