import { useQuery, QueryObserverResult } from 'react-query';

type Product = {
  name: string;
  productLine: string;
  quantity: number;
  sku: string;
  serviceLevel: string;
  serviceType: string;
  capacity: Capacity;
  subscriptions?: Subscription[];
};

type Subscription = {
  contractNumber: string;
  endDate: string;
  number: string;
  quantity: string;
  startDate: string;
  status: string;
};

interface ProductApiData {
  body: Product[];
}

type Capacity = {
  name: string;
  quantity: string;
};

const UoMNameOrder = ['Cores', 'Nodes', 'Sockets'];

const fetchProductData = async (filter: string): Promise<Product[]> => {
  const jwtToken = await window.insights.chrome.auth.getToken();

  const response = await fetch(`/api/rhsm/v2/products?status=${filter}`, {
    headers: { Authorization: `Bearer ${jwtToken}` }
  });

  const productResponseData: ProductApiData = await response.json();

  return productResponseData.body;
};

const getProducts = async (filter: string): Promise<Product[]> => {
  const productData = await fetchProductData(filter);
  return productData;
};

const useProducts = (filter: string): QueryObserverResult<Product[], unknown> => {
  return useQuery(`products.${filter}`, () => getProducts(filter));
};

export { Product, Subscription, Capacity, UoMNameOrder, useProducts as default };
