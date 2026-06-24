import { useQuery } from '@tanstack/react-query';
import { authenticateUser, getUserRbacPermissions } from '../utilities/platformServices';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

interface User {
  accountNumber: string;
  canReadProducts: boolean;
  isOrgAdmin: boolean;
}

const useUser = () => {
  const chrome = useChrome();

  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const userStatus = await authenticateUser(chrome);
      const rawRbacPermissions = await getUserRbacPermissions(chrome);
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
  });
};

export { useUser as default, User };
