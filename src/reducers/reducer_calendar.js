import { CREATE_CALENDAR } from '../actions/index';

const INITIAL_STATE = {
  all: [],
  activity: null
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CREATE_CALENDAR:
      console.log('action.payload', action.payload)
      return state;
    default:
      return state;
  }
}
