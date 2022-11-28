import { Redirect, Route, Switch } from 'react-router-dom';
import React, { Suspense, lazy, ReactNode } from 'react';
import { Processing } from './components/emptyState';
import Authentication from './components/Authentication';

const SubscriptionInventoryPage = lazy(() => import('./pages/SubscriptionInventoryPage'));
const OopsPage = lazy(() => import('./pages/OopsPage'));
const NoPermissionsPage = lazy(() => import('./pages/NoPermissionsPage'));
const DetailsPage = lazy(() => import('./pages/DetailsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

export const Routes: ReactNode = () => (
  <div className="inventory">
    <Suspense fallback={<Processing />}>
      <Authentication>
        <Switch>
          <Route exact path="/" component={SubscriptionInventoryPage} />
          <Route path="/oops" component={OopsPage} />
          <Route path="/no-permissions" component={NoPermissionsPage} />
          <Route path="/:SKU" component={DetailsPage} />
          <Route path="/not-found" component={NotFoundPage} />
          {/* Finally, catch all unmatched routes */}
          <Route>
            <Redirect to="/oops" />
          </Route>
        </Switch>
      </Authentication>
    </Suspense>
  </div>
);
