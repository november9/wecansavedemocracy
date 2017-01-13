import { combineReducers } from 'redux';
import ActivitiesReducer from './reducer_activities';
import CausesReducer from './reducer_causes';
import UserActivitiesReducer from './reducer_userActivities';
import RepresentativesReducer from './reducer_representatives';

// the syntax below allows us to avoid using the property name, 'reducer',
// as using that name could lead to naming conflicts
import { reducer as formReducer } from 'redux-form';


const rootReducer = combineReducers({
  activities: ActivitiesReducer,
  causes: CausesReducer,
  userActivities: UserActivitiesReducer,
  form: formReducer,
  representatives: RepresentativesReducer
});

export default rootReducer;
