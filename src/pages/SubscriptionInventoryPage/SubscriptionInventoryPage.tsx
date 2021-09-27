import React, { FC } from 'react';
import { withRouter } from 'react-router-dom';
import Main from '@redhat-cloud-services/frontend-components/Main';
import PageHeader from '@redhat-cloud-services/frontend-components/PageHeader';
import { PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import { useQueryClient } from 'react-query';
import { User } from '../../hooks/useUser';

const SubscriptionInventoryPage: FC = () => {
  const queryClient = useQueryClient();
  const user: User = queryClient.getQueryData('user');

  return (
    <>
      <PageHeader>
        <PageHeaderTitle title="Subscription Inventory" />
      </PageHeader>
      <Main>Main stuff.</Main>
    </>
  );
};

export default withRouter(SubscriptionInventoryPage);
