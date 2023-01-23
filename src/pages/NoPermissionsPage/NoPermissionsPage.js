import React, { useEffect } from 'react';
import Main from '@redhat-cloud-services/frontend-components/Main';
import NotAuthorized from '@redhat-cloud-services/frontend-components/NotAuthorized';

const NoPermissionsPage = () => {
  useEffect(() => {
    insights?.chrome?.appAction?.('no-permissions');
  }, []);

  return (
    <Main>
      <NotAuthorized serviceName="Inventory" />
    </Main>
  );
};

export default NoPermissionsPage;
