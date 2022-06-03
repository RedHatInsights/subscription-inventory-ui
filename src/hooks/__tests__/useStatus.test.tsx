import { renderHook } from '@testing-library/react-hooks';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';
import { createQueryWrapper } from '../../utilities/testHelpers';
import useStatus from '../useStatus';

enableFetchMocks();

describe('useStatus', () => {
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
  it('returns statuses from the API', async () => {
    const statusData = [
      {
        active: 30,
        expiringSoon: 5,
        expired: 1,
        futureDated: 3
      }
    ];

    fetch.mockResponseOnce(JSON.stringify({ body: [...statusData] }));

    const { result, waitFor } = renderHook(() => useStatus(), {
      wrapper: createQueryWrapper()
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual(statusData);
  });
});
