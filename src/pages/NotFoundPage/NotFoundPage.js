import React, { useEffect } from 'react';
import Main from '@redhat-cloud-services/frontend-components/Main';
import NotFound from './NotFound';
import { withRouter } from 'react-router-dom';

const NotFoundPage = () => {
  useEffect(() => {
    window.insights?.chrome?.appAction?.('notFound-page');
  }, []);
  return (
    <Main>
      <NotFound />
    </Main>
  );
};

export default withRouter(NotFoundPage);
