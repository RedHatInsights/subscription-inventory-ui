import { renderHook } from '@testing-library/react-hooks';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';
import { createQueryWrapper } from '../../utilities/testHelpers';
import useProducts from '../useProducts';

enableFetchMocks();

describe('useProducts', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'insights', {
      value: {
        chrome: {
          auth: {
            getToken: jest.fn()
          }
        }
      }
    });
  });
  it('returns products from the API', async () => {
    const productData = [
      {
        name: 'Truck',
        productLine: 'vehicles',
        quantity: 1400,
        sku: 'ZZZ777'
      }
    ];

    fetch.mockResponseOnce(JSON.stringify({ body: [...productData] }));

    const { result, waitFor } = renderHook(() => useProducts(false), {
      wrapper: createQueryWrapper()
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual(productData);
  });
});
