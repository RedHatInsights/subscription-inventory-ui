import { useQuery, QueryObserverResult } from 'react-query';
import { Product } from './useProducts';
import { HttpError } from '../utilities/errors';

interface SingleProductApiData {
  body: Product;
}

const fetchProductData = async (sku: string): Promise<Product> => {
  const jwtToken = await window.insights.chrome.auth.getToken();

  const response = await fetch(`/api/rhsm/v2/products/${sku}`, {
    headers: { Authorization: `Bearer ${jwtToken}` }
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

const getSingleProduct = async (sku: string): Promise<Product> => {
  const productData = fetchProductData(sku);

  return productData;
};

const useSingleProduct = (sku: string): QueryObserverResult<Product, unknown> => {
  return useQuery({
    queryKey: `singleProduct.${sku}`,
    queryFn: () => getSingleProduct(sku),
    retry: (failureCount, error) => {
      if (failureCount < 3 && (error as HttpError).status != 404) {
        return true;
      }
      return false;
    }
  });
};

export { useSingleProduct as default };
