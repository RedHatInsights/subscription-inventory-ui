import { useQuery } from 'react-query';
import { useAuthenticateUser, useUserRbacPermissions } from '../utilities/platformServices';

interface User {
  accountNumber: string;
  canReadProducts: boolean;
  isOrgAdmin: boolean;
}

const useUser = () => {
  const authenticateUser = useAuthenticateUser();
  const userRbacPermissions = useUserRbacPermissions();

  return useQuery('user', async () => {
    const userStatus = await authenticateUser;
    const rawRbacPermissions = await userRbacPermissions;
    const rbacPermissions = rawRbacPermissions.map((rawPermission) => rawPermission.permission);
    const user: User = {
      accountNumber: userStatus.identity.account_number,
      canReadProducts:
        rbacPermissions.includes('subscriptions:products:read') ||
        rbacPermissions.includes('subscriptions:*:*'),
      isOrgAdmin: userStatus.identity.user.is_org_admin === true
    };
    return user;
  });
};

export { useUser as default, User };
