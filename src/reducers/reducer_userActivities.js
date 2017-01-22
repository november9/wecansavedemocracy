import { ADD_USER_ACTIVITY, LOOK_FOR_REPS, SUBMIT_ACTIVITY_WITH_REPS, FETCH_USER_ACTIVITIES, DELETE_USER_ACTIVITIES } from '../actions/index';
import sortByDate from '../utils/sortByDate';
import { browserHistory } from 'react-router';

let tempActivityList

const INITIAL_STATE = {
  all: [],
  selectedReps: [],
  tempActivityData: {}
};

export default function (state = INITIAL_STATE, action) {
  switch(action.type) {
  case ADD_USER_ACTIVITY:
    state.all.push(action.payload);
    tempActivityList = state.all;
    state.all = [];
    state.all = sortByDate(tempActivityList);
    tempActivityList = [];
    state.tempActivityData = {};
    browserHistory.push('/');
    return state;
  case FETCH_USER_ACTIVITIES:
    tempActivityList = sortByDate(action.payload).concat();
    return {
      ...state,
      all: tempActivityList
    };
  case LOOK_FOR_REPS:
    state.tempActivityData = action.payload;
    browserHistory.push('/find-representative');
    return state;
  case DELETE_USER_ACTIVITIES:
    tempActivityList = _.filter(action.payload, (val, key) => {
      return val.selected !== true;
    });
    return {
      ...state,
      all: tempActivityList
    };
  default:
    return state;
  }
}
