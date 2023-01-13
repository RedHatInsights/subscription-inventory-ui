import { useQuery } from 'react-query';
import { HttpError } from '../utilities/errors';

interface ExportSubscriptionsBody {
  blob: Blob;
  filename: string;
}

const parseFilename = (headers: any): string => {
  return headers.get('Content-Disposition')?.split(';')[1]?.split('=')[1]?.replaceAll('"', '');
};

const fetchExportSusbcriptionsData = async () => {
  const jwtToken = await window.insights.chrome.auth.getToken();

  const response = await fetch('/api/rhsm/v2/products/export', {
    headers: { Authorization: `Bearer ${jwtToken}` }
  });

  if (!response.ok) {
    throw new HttpError('Failed to download export', response.status, response.statusText);
  }
  const blob = await response.blob();
  const filename = parseFilename(response.headers);

  return { blob, filename } as ExportSubscriptionsBody;
};

const getExportSubscriptions = async () => {
  return await fetchExportSusbcriptionsData();
};

const useExportSubscriptions = () => {
  return useQuery('export', () => getExportSubscriptions(), {
    enabled: false,
    retry: 0
  });
};

export { useExportSubscriptions as default };
