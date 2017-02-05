import reducer from './reducer_activities';
import chai, { expect } from 'chai';

describe("Activities Reducer", () => {
  it("should return initial state", () => {
    const INITIAL_STATE = {
      all: [],
      activity: null
    };

    expect(reducer(undefined, {type: 'FOO'})).to.eql(INITIAL_STATE);
  });
});