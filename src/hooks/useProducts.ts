import { useQuery, QueryObserverResult } from 'react-query';
import Cookies from 'js-cookie';

type ProductEntry = {
  name: string;
  productLine: string;
  quantity: number;
  sku: string;
};

interface ProductApiData {
  body: ProductEntry[];
}

const fetchProductData = async (): Promise<ProductEntry[]> => {
  const jwtToken = Cookies.get('cs_jwt');

  const response = await fetch('/api/rhsm/v2/products', {
    headers: { Authorization: `Bearer ${jwtToken}` }
  });

  const productResponseData: ProductApiData = await response.json();

  return productResponseData.body;
};

const getProducts = async (): Promise<ProductEntry[]> => {
  const productData = await fetchProductData();
  return productData;
};

const useProducts = (): QueryObserverResult<ProductEntry[], unknown> => {
  return useQuery('products', () => getProducts());
};

export { useProducts as default };
