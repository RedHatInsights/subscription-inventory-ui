import { renderHook } from '@testing-library/react-hooks';
import { createQueryWrapper } from '../../utilities/testHelpers';
import useExportSubscriptions from '../useExportSubscriptions';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

Object.defineProperty(window, 'insights', {
  value: {
    chrome: {
      auth: {
        getToken: jest.fn()
      }
    }
  }
});

describe('useExportSubscriptions', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it("doesn't query initially", () => {
    const { result } = renderHook(() => useExportSubscriptions(), {
      wrapper: createQueryWrapper()
    });

    expect(result.current.isIdle).toBeTruthy();
  });

  describe('returns a blob and filename from the API', () => {
    fetch.mockResponse((_) =>
      Promise.resolve({
        body: 'test',
        headers: {
          'Content-Disposition': 'attachment; filename="test.csv"'
        }
      })
    );
    const { result, waitFor } = renderHook(() => useExportSubscriptions(), {
      wrapper: createQueryWrapper()
    });

    result.current.refetch();

    it('has correct blob value', async () => {
      await waitFor(() => result.current.isSuccess);
      expect(await result.current.data.blob.text()).toEqual('test');
    });
    it('has correct filename', async () => {
      await waitFor(() => result.current.isSuccess);
      expect(result.current.data.filename).toEqual('test.csv');
    });
  });
});
