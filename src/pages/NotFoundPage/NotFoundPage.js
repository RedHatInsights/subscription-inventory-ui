import React, { useEffect } from 'react';
import NotFound from './NotFound';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { PageSection } from '@patternfly/react-core/dist/dynamic/components/Page';

const NotFoundPage = () => {
  const chrome = useChrome();

  useEffect(() => {
    chrome.appAction('notFound-page');
  }, []);
  return (
    <PageSection>
      <NotFound />
    </PageSection>
  );
};

export default NotFoundPage;
