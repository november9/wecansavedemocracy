import { FIND_REP } from '../actions/index';

const INITIAL_STATE = {
  representativeData: null
};

export default function (state = INITIAL_STATE, action) {
  switch(action.type) {
  case FIND_REP:
    return {...state, representativeData: action.payload.data};
  default:
    return state;
  }
}
