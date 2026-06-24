import { useAccessCheckContext } from '@project-kessel/react-kessel-access-check';
import { checkSelf } from '@project-kessel/react-kessel-access-check/core/api-client';
import { renderHook, waitFor } from '@testing-library/react';
import { Relation, useHasRelation } from '../useHasRelation';
import { createQueryWrapper } from '../../utilities/testHelpers';

jest.mock('@project-kessel/react-kessel-access-check');
jest.mock('@project-kessel/react-kessel-access-check/core/api-client');

describe('useHasRelation hook', () => {
  beforeEach(() => {
    (useAccessCheckContext as jest.Mock).mockReturnValue(true);
  });

  it('returns true when access check passes', async () => {
    (checkSelf as jest.Mock).mockReturnValue({ allowed: 'ALLOWED_TRUE' });

    const { result } = renderHook(() => useHasRelation(Relation.INVENTORY_VIEW), {
      wrapper: createQueryWrapper()
    });

    await waitFor(() => expect(result.current.has).toBe(true));
  });

  it('returns false while loading', () => {
    (checkSelf as jest.Mock).mockReturnValue({ allowed: 'ALLOWED_TRUE' });

    const { result } = renderHook(() => useHasRelation(Relation.INVENTORY_VIEW), {
      wrapper: createQueryWrapper()
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.has).toBe(false);
  });

  it('returns false when access check fails', async () => {
    (checkSelf as jest.Mock).mockReturnValue({ allowed: 'ALLOWED_FALSE' });

    const { result } = renderHook(() => useHasRelation(Relation.INVENTORY_VIEW), {
      wrapper: createQueryWrapper()
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await waitFor(() => expect(result.current.has).toBe(false));
  });

  it('returns false on query error', async () => {
    (checkSelf as jest.Mock).mockImplementation(() => {
      throw new Error('whoops');
    });

    const { result } = renderHook(() => useHasRelation(Relation.INVENTORY_VIEW), {
      wrapper: createQueryWrapper()
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    await waitFor(() => expect(result.current.has).toBe(false));
  });

  describe('unexpected response from kessel', () => {
    it('returns false on empty object', async () => {
      (checkSelf as jest.Mock).mockReturnValue({});

      const { result } = renderHook(() => useHasRelation(Relation.INVENTORY_VIEW), {
        wrapper: createQueryWrapper()
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      await waitFor(() => expect(result.current.has).toBe(false));
    });

    it('returns false on unexpected allowed value', async () => {
      (checkSelf as jest.Mock).mockReturnValue({ allowed: 'A_WEIRD_VALUE' });

      const { result } = renderHook(() => useHasRelation(Relation.INVENTORY_VIEW), {
        wrapper: createQueryWrapper()
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      await waitFor(() => expect(result.current.has).toBe(false));
    });
  });
});
