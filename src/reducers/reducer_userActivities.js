import { ADD_USER_ACTIVITY, LOOK_FOR_REPS, SUBMIT_ACTIVITY_WITH_REPS, UPDATE_USER_ACTIVITY } from '../actions/index';
import { browserHistory } from 'react-router';

const INITIAL_STATE = {
  all: [],
  selectedReps: [],
  tempActivityData: {}
};

export default function (state = INITIAL_STATE, action) {
  switch(action.type) {
  case ADD_USER_ACTIVITY:
    state.all.push(action.payload);
    state.tempActivityData = {};
    browserHistory.push('/');
    return state;
  case LOOK_FOR_REPS:
    state.tempActivityData = action.payload;
    browserHistory.push('/find-representative');
    return state;
  default:
    return state;
  }
}
