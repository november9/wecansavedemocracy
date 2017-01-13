import { FETCH_CAUSES } from '../actions/index';

const INITIAL_STATE = {
  all: [],
  activity: null
};

export default function (state = INITIAL_STATE, action) {
  switch(action.type) {
  case FETCH_CAUSES:
    return {...state, all: action.payload.data};
  default:
    return state;
  }

}
