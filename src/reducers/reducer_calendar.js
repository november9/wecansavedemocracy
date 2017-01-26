import { CREATE_CALENDAR } from '../actions/index';

const INITIAL_STATE = {
  calendar: null
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CREATE_CALENDAR:
      state.calendar = action.payload;
      return state;
    default:
      return state;
  }
}
