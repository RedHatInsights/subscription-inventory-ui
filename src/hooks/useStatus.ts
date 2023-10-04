import { useQuery, QueryObserverResult } from 'react-query';
import { useToken } from '../utilities/platformServices';

type StatusCard = {
  active: number;
  expiringSoon: number;
  expired: number;
  futureDated: number;
};

interface StatusApiData {
  body: StatusCard;
}

const fetchStatusData = (jwtToken: Promise<string>) => async (): Promise<StatusCard> => {
  const response = await fetch('/api/rhsm/v2/products/status', {
    headers: { Authorization: `Bearer ${await jwtToken}` }
  });

  const statusResponseData: StatusApiData = await response.json();

  return statusResponseData.body;
};

const useStatus = (): QueryObserverResult<StatusCard, unknown> => {
  const jwtToken = useToken();

  return useQuery('status', () => fetchStatusData(jwtToken)());
};

export { useStatus as default, StatusCard };
