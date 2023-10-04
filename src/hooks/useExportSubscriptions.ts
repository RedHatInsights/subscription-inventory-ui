import { useQuery } from 'react-query';
import { HttpError } from '../utilities/errors';
import { useToken } from '../utilities/platformServices';

interface ExportSubscriptionsBody {
  blob: Blob;
  filename: string;
}

const parseFilename = (headers: any): string => {
  return headers.get('Content-Disposition')?.split(';')[1]?.split('=')[1]?.replaceAll('"', '');
};

const fetchExportSubscriptionsData = (jwtToken: Promise<string>) => async () => {
  const response = await fetch('/api/rhsm/v2/products/export', {
    headers: { Authorization: `Bearer ${await jwtToken}` }
  });

  if (!response.ok) {
    throw new HttpError('Failed to download export', response.status, response.statusText);
  }
  const blob = await response.blob();
  const filename = parseFilename(response.headers);

  return { blob, filename } as ExportSubscriptionsBody;
};

const useExportSubscriptions = () => {
  const jwtToken = useToken();
  return useQuery('export', () => fetchExportSubscriptionsData(jwtToken)(), {
    enabled: false,
    retry: 0
  });
};

export { useExportSubscriptions as default };
