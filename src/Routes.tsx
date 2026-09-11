import { Navigate, Route, Routes } from 'react-router-dom';
import React, { Suspense, lazy, useEffect } from 'react';
import { Processing } from './components/emptyState';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import useFeatureFlag from './hooks/useFeatureFlag';
import { SubsWidget } from './components/Widgets/SubscriptionsWidget';

const SubscriptionInventoryPage = lazy(() => import('./pages/SubscriptionInventoryPage'));
const OopsPage = lazy(() => import('./pages/OopsPage'));
const DetailsPage = lazy(() => import('./pages/DetailsPage'));

export const InventoryRoutes: React.FC = () => {
  const shouldShowWidgetTest = useFeatureFlag('subscription-inventory.show-test-widget');
  const chrome = useChrome();

  useEffect(() => {
    chrome.hideGlobalFilter(true);
  }, []);

  return (
    <div className="inventory">
      <Suspense fallback={<Processing />}>
        <Routes>
          <Route path="/" element={<SubscriptionInventoryPage />} />
          <Route path="/oops" element={<OopsPage />} />
          <Route path="/:SKU" element={<DetailsPage />} />
          {shouldShowWidgetTest && <Route path="/widget-test" element={<SubsWidget />} />}
          {/* Finally, catch all unmatched routes */}
          <Route path="*" element={<Navigate to="/oops" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
};
