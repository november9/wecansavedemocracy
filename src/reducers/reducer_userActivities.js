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
  let tempActivityList = [];
  let tempActivityListSorted = [];

  switch(action.type) {
  case ADD_USER_ACTIVITY:
    state.all.push(action.payload);
    tempActivityList = state.all;
    state.all = [];
    state.all = sortByDate(tempActivityList);
    tempActivityList = [];
    state.tempActivityData = {};
    localStorage.setItem('userActivities', JSON.stringify(state.all));
    return state;
    //
    //
    //
    // console.log('we made it to add!');
    // tempActivityList = state.all;
    // tempActivityList.push(action.payload);
    // tempActivityListSorted = sortByDate(tempActivityList);
    //
    // state.all = [];
    // state.tempActivityData = {};
    // return {
    //   ...state,
    //   all: tempActivityListSorted
    // };
  case FETCH_USER_ACTIVITIES:
    tempActivityList = sortByDate(action.payload).concat();
    localStorage.setItem('userActivities', JSON.stringify(tempActivityList));
    return {
      ...state,
      all: tempActivityList
    };
  case LOOK_FOR_REPS:
    state.tempActivityData = action.payload;
    return state;
  case DELETE_USER_ACTIVITIES:
    tempActivityList = _.filter(action.payload, (val, key) => {
      return val.selected !== true;
    });
    localStorage.setItem('userActivities', JSON.stringify(tempActivityList));
    return {
      ...state,
      all: tempActivityList
    };
  default:
    // console.log('default from reducer!', state.all);
    // localStorage.setItem('userActivities', JSON.stringify(state.all));
    return state;
  }
}
