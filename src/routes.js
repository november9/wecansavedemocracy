import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/app';
import ActivitiesList from './components/activities_index';
import ActivitiesNew from './components/activities_new';
import FindRep from './components/findRepresentative';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={ActivitiesList} />
    <Route path="actions/new" component={ActivitiesNew} />
    <Route path="find-representative" component={FindRep} />
  </Route>
);
