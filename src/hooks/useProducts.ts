import { useQuery, QueryObserverResult } from '@tanstack/react-query';
import { useToken } from '../utilities/platformServices';
import { HttpError } from '../utilities/errors';

type Product = {
  name: string;
  productLine: string;
  quantity: number;
  sku: string;
  serviceLevel: string;
  serviceType: string;
  capacity: Capacity;
  subscriptions?: Subscription[];
  virtLimit?: string;
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

const fetchProductData =
  (jwtToken: Promise<string>) =>
  async (filter: string): Promise<Product[]> => {
    const response = await fetch(`/api/rhsm/v2/products?status=${filter}`, {
      headers: { Authorization: `Bearer ${await jwtToken}` }
    });

    if (!response.ok) {
      throw new HttpError('Failed to fetch products', response.status, response.statusText);
    }

    const productResponseData: ProductApiData = await response.json();

    return productResponseData.body;
  };

const useProducts = (filter: string): QueryObserverResult<Product[], unknown> => {
  const jwtToken = useToken();
  return useQuery({
    queryKey: ['products', filter],
    queryFn: () => fetchProductData(jwtToken)(filter)
  });
};

export { Product, Subscription, Capacity, UoMNameOrder, useProducts as default };
