import { renderHook, waitFor } from '@testing-library/react';
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

    expect(result.current.status).toBe('pending');
    expect(result.current.fetchStatus).toBe('idle');
  });

  describe('returns a blob and filename from the API', () => {
    beforeEach(() => {
      fetch.mockResponse('test', {
        headers: {
          'Content-Disposition': 'attachment; filename="test.csv"'
        }
      });
    });

    it('has correct blob value', async () => {
      const { result } = renderHook(() => useExportSubscriptions(), {
        wrapper: createQueryWrapper()
      });

      result.current.refetch();

      await waitFor(async () => {
        expect(await result.current.data.blob.text()).toEqual('test');
      });
    });
    it('has correct filename', async () => {
      const { result } = renderHook(() => useExportSubscriptions(), {
        wrapper: createQueryWrapper()
      });

      result.current.refetch();

      await waitFor(() => expect(result.current.data.filename).toEqual('test.csv'));
    });
  });
});
