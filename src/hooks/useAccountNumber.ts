import { useQuery } from '@tanstack/react-query';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const useAccountNumber = () => {
  const chrome = useChrome();

  return useQuery({
    queryKey: ['accountNumber'],
    queryFn: async () => {
      const user = await chrome.auth.getUser();
      // React Query rejects an undefined result, so fall back to null
      return user ? (user.identity.account_number ?? null) : null;
    }
  });
};

export default useAccountNumber;
