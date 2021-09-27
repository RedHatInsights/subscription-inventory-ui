import { Redirect, Route, Switch } from 'react-router-dom';
import React, { Suspense, lazy, ReactNode } from 'react';
import { Processing } from './components/emptyState';
import Authentication from './components/Authentication';

const SubscriptionInventoryPage = lazy(() => import('./pages/SubscriptionInventoryPage'));
const OopsPage = lazy(() => import('./pages/OopsPage'));
const NoPermissionsPage = lazy(() => import('./pages/NoPermissionsPage'));

export const Routes: ReactNode = () => (
  <div className="manifests">
    <Suspense fallback={<Processing />}>
      <Authentication>
        <Switch>
          <Route exact path="/" component={SubscriptionInventoryPage} />
          <Route path="/oops" component={OopsPage} />
          <Route path="/no-permissions" component={NoPermissionsPage} />
          {/* Finally, catch all unmatched routes */}
          <Route>
            <Redirect to="/oops" />
          </Route>
        </Switch>
      </Authentication>
    </Suspense>
  </div>
);
