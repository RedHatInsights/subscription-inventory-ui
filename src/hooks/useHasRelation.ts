import { useAccessCheckContext } from '@project-kessel/react-kessel-access-check';
import { checkSelf } from '@project-kessel/react-kessel-access-check/core/api-client';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { useQuery } from '@tanstack/react-query';

// 5 minutes * 60 seconds * 1000 milliseconds
const QUERY_STALE_TIME = 5 * 60 * 1000;

export enum Relation {
  INVENTORY_VIEW = 'subscriptions_product_view',
  INVENTORY_EDIT = 'subscriptions_product_edit'
}

interface HasRelationResult {
  has: boolean;
  isLoading: boolean;
}

/**
 * useHasRelation checks if the current user has a given relation on the default workspace
 */
export const useHasRelation = (relation: Relation): HasRelationResult => {
  const accessCheckContext = useAccessCheckContext();
  const chrome = useChrome();

  const { data: has, isLoading: accessCheckIsLoading } = useQuery({
    queryKey: ['kessel', relation],
    queryFn: async () => {
      const user = await chrome.auth.getUser();

      if (!user) {
        throw new Error('user does not exist');
      }

      return (
        (
          await checkSelf(accessCheckContext, {
            relation,
            resource: {
              id: `redhat/${user.identity.org_id}`,
              type: 'tenant',
              reporter: { type: 'rbac' }
            }
          })
        ).allowed === 'ALLOWED_TRUE'
      );
    },
    staleTime: QUERY_STALE_TIME
  });

  return {
    has: !!has,
    isLoading: accessCheckIsLoading
  };
};
