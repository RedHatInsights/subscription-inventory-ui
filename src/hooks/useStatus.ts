import { useQuery, QueryObserverResult } from 'react-query';
import Cookies from 'js-cookie';

type StatusCard = {
  active: number;
  expiringSoon: number;
  expired: number;
  futureDated: number;
};

interface StatusApiData {
  body: StatusCard;
}

const fetchStatusData = async (): Promise<StatusCard> => {
  const jwtToken = Cookies.get('cs_jwt');

  const response = await fetch('/api/rhsm/v2/products/status', {
    headers: { Authorization: `Bearer ${jwtToken}` }
  });

  const statusResponseData: StatusApiData = await response.json();

  return statusResponseData.body;
};

const getStatus = async (): Promise<StatusCard> => {
  const statusData = await fetchStatusData();

  return statusData;
};

const useStatus = (): QueryObserverResult<StatusCard, unknown> => {
  return useQuery('status', () => getStatus());
};

export { useStatus as default, StatusCard };
