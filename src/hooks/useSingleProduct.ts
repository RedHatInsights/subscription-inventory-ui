import { useQuery, QueryObserverResult } from 'react-query';
import { Product } from './useProducts';

interface SingleProductApiData {
  body: Product;
}

class HttpError extends Error {
  status: number;
  statusText: string;
  constructor(message: string, status: number, statusText: string) {
    super(message);
    this.status = status;
    this.statusText = statusText;
  }
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
      if (failureCount < 3 && !String(error).includes('404')) {
        return true;
      }
      return false;
    }
  });
};

export { useSingleProduct as default, HttpError };
