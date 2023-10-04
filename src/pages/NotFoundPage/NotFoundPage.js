import React, { useEffect } from 'react';
import Main from '@redhat-cloud-services/frontend-components/Main';
import NotFound from './NotFound';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const NotFoundPage = () => {
  const chrome = useChrome();

  useEffect(() => {
    chrome.appAction('notFound-page');
  }, []);
  return (
    <Main>
      <NotFound />
    </Main>
  );
};

export default NotFoundPage;
