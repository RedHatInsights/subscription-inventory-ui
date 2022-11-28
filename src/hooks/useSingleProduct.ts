import { useQuery, QueryObserverResult } from 'react-query';
import { Product } from './useProducts';

interface SingleProductApiData {
  body: Product;
}

const fetchProductData = async (sku: string):Promise<Product>  => {
  const jwtToken = await window.insights.chrome.auth.getToken();

  const response = await fetch(`/api/rhsm/v2/products/${sku}`, {
    headers: { Authorization: `Bearer ${jwtToken}` }
  })

  if (!response.ok) {
    console.log("error")
    throw new Error(
      `Status Code ${response.status}.  Error fetching sku: ${response.statusText}.`
    );
  }


  const productResponseData: SingleProductApiData = await response.json();

  return productResponseData.body;
};

const getSingleProduct = async (sku: string): Promise<Product> => {
  const productData = await fetchProductData(sku);

  return productData;
};

const useSingleProduct = (sku: string): QueryObserverResult<Product, unknown> => {
  return useQuery(`singleProduct.${sku}`, () => getSingleProduct(sku));
};

export { useSingleProduct as default };
