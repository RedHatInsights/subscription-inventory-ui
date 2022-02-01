interface RawProduct {
  Name: string;
  SKU: string;
  ProductLine: string;
  Count: number;
}

interface Product {
  name: string;
  sku: string;
  productLine: string;
  count: number;
}

const rawProducts: RawProduct[] = [
  {
    Name: 'Red Hat Metered OSD Pay as You Go',
    SKU: 'MSTEST1',
    ProductLine: 'Miscellaneous',
    Count: 3
  },
  {
    Name: 'Red Hat Satellite Infrastructure Subscription',
    SKU: 'MCT3718',
    ProductLine: 'Red Hat Satellite',
    Count: 50
  },
  {
    Name: 'Internal Engineering SKU for Shadow Content',
    SKU: 'SER0410',
    ProductLine: 'RHEL',
    Count: 1
  },
  {
    Name: 'Red Hat Enterprise Linux for Service Providers, Premium - On Demand',
    SKU: 'RH00497',
    ProductLine: 'RHEL',
    Count: 14
  }
];

const getProducts = (): Product[] => {
  return rawProducts.map((rawProduct) => {
    return {
      name: rawProduct.Name,
      sku: rawProduct.SKU,
      productLine: rawProduct.ProductLine,
      count: rawProduct.Count
    };
  });
};

const useProducts = (): Product[] => {
  return getProducts();
};

export { useProducts as default };
