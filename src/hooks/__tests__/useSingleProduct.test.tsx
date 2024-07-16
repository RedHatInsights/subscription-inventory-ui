import { renderHook, waitFor } from '@testing-library/react';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';
import useSingleProduct from '../useSingleProduct';
import { HttpError } from '../../utilities/errors';
import { createQueryWrapper } from '../../utilities/testHelpers';

enableFetchMocks();
jest.mock('../../utilities/platformServices', () => ({
  useToken: jest.fn()
}));

describe('useSingleProduct', () => {
  const sku = 'TESTSKU';
  const productData = {
    name: 'TEST Name',
    productLine: 'TEST Line',
    quantity: 3,
    sku: 'TESTSKU',
    serviceLevel: 'TEST serviceLevel',
    serviceType: 'TEST serviceType',
    capacity: { name: 'test', quantity: 2 }
  };

  it('returns a product from the API', async () => {
    fetch.mockResponseOnce(JSON.stringify({ body: { ...productData } }));
    const { result } = renderHook(() => useSingleProduct(sku), {
      wrapper: createQueryWrapper()
    });
    await waitFor(() => {
      expect(result.current.data).toEqual(productData);
    });
  });
  it('handles HTTP error', async () => {
    fetch.mockResponseOnce(JSON.stringify({ message: 'Not Found' }), { status: 404 });
    const { result } = renderHook(() => useSingleProduct(sku), {
      wrapper: createQueryWrapper()
    });
    await waitFor(() => {
      expect(result.current.error).toBeInstanceOf(HttpError);
      expect((result.current.error as HttpError).status).toBe(404);
    });
  });
  it('does not retry on 404 error', async () => {
    fetch.mockResponseOnce(JSON.stringify({ message: 'Not Found' }), { status: 404 });
    const { result } = renderHook(() => useSingleProduct(sku), {
      wrapper: createQueryWrapper()
    });
    await waitFor(() => {
      expect(result.current.error).toBeInstanceOf(HttpError);
      expect((result.current.error as HttpError).status).toBe(404);
    });
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
