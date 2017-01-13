import { FETCH_ACTIVITIES, FETCH_ACTIVITY, FETCH_ACTIVITIES_FROM_CAUSES } from '../actions/index';

const INITIAL_STATE = {
  all: [],
  activity: null
};

export default function (state = INITIAL_STATE, action) {
  switch(action.type) {
  case FETCH_ACTIVITY:
    return {...state, activity: action.payload.data};
  case FETCH_ACTIVITIES:
    return {...state, all: action.payload.data};
  default:
    return state;
  }
}
