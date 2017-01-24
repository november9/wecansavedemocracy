import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './containers/app';
import ActivitiesList from './containers/ActivitiesList/activities_index';
import ActivitiesNew from './containers/ActivitiesNew/activities_new';
import FindRep from './containers/FindRep/findRepresentative';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={ActivitiesList} />
    <Route path="actions/new" component={ActivitiesNew} />
    <Route path="find-representative" component={FindRep} />
  </Route>
);
