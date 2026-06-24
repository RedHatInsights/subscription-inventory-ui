import { useQuery } from '@tanstack/react-query';
import { authenticateUser } from '../utilities/platformServices';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

interface User {
  accountNumber: string;
  isOrgAdmin: boolean;
}

const useUser = () => {
  const chrome = useChrome();

  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const userStatus = await authenticateUser(chrome);
      const user: User = {
        accountNumber: userStatus.identity.account_number,
        isOrgAdmin: userStatus.identity.user.is_org_admin === true
      };
      return user;
    }
  });
};

export { useUser as default, User };
