import { QueryObserverResult, useQuery } from '@tanstack/react-query';
import { Product } from './useProducts';
import { HttpError } from '../utilities/errors';
import { useToken } from '../utilities/platformServices';

interface SingleProductApiData {
  body: Product;
}

const fetchSingleProduct =
  (jwtToken: Promise<string>) =>
  async (sku: string): Promise<Product> => {
    const response = await fetch(`/api/rhsm/v2/products/${sku}`, {
      headers: { Authorization: `Bearer ${await jwtToken}` }
    });

    if (!response.ok) {
      throw new HttpError(
        `Status Code ${response.status}.  Error fetching sku: ${response.statusText}.`,
        response.status,
        response.statusText
      );
    }

    const productResponseData: SingleProductApiData = await response.json();

    return productResponseData.body;
  };

const useSingleProduct = (sku: string): QueryObserverResult<Product, unknown> => {
  const jwtToken = useToken();

  return useQuery({
    queryKey: ['singleProduct', sku],
    queryFn: () => fetchSingleProduct(jwtToken)(sku),
    retry: (failureCount, error) => {
      if (failureCount < 3 && (error as HttpError).status != 404) {
        return true;
      }
      return false;
    }
  });
};

export { useSingleProduct as default };
