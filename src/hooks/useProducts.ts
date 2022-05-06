import { useQuery, QueryObserverResult } from 'react-query';
import Cookies from 'js-cookie';

type Product = {
  name: string;
  productLine: string;
  quantity: number;
  sku: string;
  serviceLevel: string;
  unitOfMeasure: UnitOfMeasure;
};

interface ProductApiData {
  body: Product[];
}

type UnitOfMeasure = {
  name: string;
  quantity: string;
};

const fetchProductData = async (): Promise<Product[]> => {
  const jwtToken = Cookies.get('cs_jwt');

  const response = await fetch('/api/rhsm/v2/products', {
    headers: { Authorization: `Bearer ${jwtToken}` }
  });

  const productResponseData: ProductApiData = await response.json();

  return productResponseData.body;
};

const getProducts = async (): Promise<Product[]> => {
  const productData = await fetchProductData();
  return productData;
};

const useProducts = (): QueryObserverResult<Product[], unknown> => {
  return useQuery('products', () => getProducts());
};

export { Product, UnitOfMeasure, useProducts as default };
