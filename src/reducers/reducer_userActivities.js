import { ADD_USER_ACTIVITY, LOOK_FOR_REPS, SUBMIT_ACTIVITY_WITH_REPS, FETCH_USER_ACTIVITIES } from '../actions/index';
import sortByDate from '../utils/sortByDate';
import { browserHistory } from 'react-router';

let tempActivityList

const INITIAL_STATE = {
  all: [],
  selectedReps: [],
  tempActivityData: {}
};

export default function (state = INITIAL_STATE, action) {

  // function sortAndAddToState () {
  //   let tempActivityList = state.all;
  //   state.all = [];
  //   state.all = sortByDate(tempActivityList);
  //   tempActivityList = [];
  // }

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
    console.log('FETCH_USER_ACTIVITIES');
    tempActivityList = state.all;
    state.all = [];
    state.all = sortByDate(tempActivityList);
    tempActivityList = [];
    return state;
  case LOOK_FOR_REPS:
    state.tempActivityData = action.payload;
    browserHistory.push('/find-representative');
    return state;
  default:
    return state;
  }
}
