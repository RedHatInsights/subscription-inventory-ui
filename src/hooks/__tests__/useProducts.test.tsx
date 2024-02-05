import { renderHook, waitFor } from '@testing-library/react';
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

    const { result } = renderHook(() => useProducts(''), {
      wrapper: createQueryWrapper()
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(productData);
    });
  });
});
