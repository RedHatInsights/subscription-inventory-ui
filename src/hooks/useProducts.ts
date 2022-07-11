import { useQuery, QueryObserverResult } from 'react-query';

type Product = {
  name: string;
  productLine: string;
  quantity: number;
  sku: string;
  serviceLevel: string;
  serviceType: string;
  unitOfMeasure: UnitOfMeasure;
};

interface ProductApiData {
  body: Product[];
}

type UnitOfMeasure = {
  name: string;
  quantity: string;
};

const UoMNameOrder = ['Cores', 'Nodes', 'Sockets'];

const fetchProductData = async (filter: string, setDelay: boolean): Promise<Product[]> => {
  const jwtToken = await window.insights.chrome.auth.getToken();

  if (setDelay) {
    await new Promise((r) => setTimeout(r, 200));
  }

  const response = await fetch(`/api/rhsm/v2/products?status=${filter}`, {
    headers: { Authorization: `Bearer ${jwtToken}` }
  });

  const productResponseData: ProductApiData = await response.json();

  return productResponseData.body;
};

const getProducts = async (filter: string, setDelay: boolean): Promise<Product[]> => {
  const productData = await fetchProductData(filter, setDelay);
  return productData;
};

const useProducts = (filter:string, setDelay: boolean): QueryObserverResult<Product[], unknown> => {
  return useQuery(`products.${filter}`, () => getProducts(filter, setDelay));
};

export { Product, UnitOfMeasure, UoMNameOrder, useProducts as default };
