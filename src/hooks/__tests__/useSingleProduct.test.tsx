import { renderHook } from '@testing-library/react-hooks';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';
import { createQueryWrapper } from '../../utilities/testHelpers';
import useSingleProduct from '../useSingleProduct';

enableFetchMocks();

describe('useSingleProduct', () => {
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
  it('returns a product from the API', async () => {
    const productData = {
      name: 'TEST Name',
      productLine: 'TEST Line',
      quantity: 3,
      sku: 'TESTSKU',
      serviceLevel: 'TEST serviceLevel',
      serviceType: 'TEST serviceType',
      capacity: { name: 'test', quantity: 2 }
    };

    fetch.mockResponseOnce(JSON.stringify({ body: { ...productData } }));

    const { result, waitFor } = renderHook(() => useSingleProduct('TESTSKU'), {
      wrapper: createQueryWrapper()
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual(productData);
  });
});
