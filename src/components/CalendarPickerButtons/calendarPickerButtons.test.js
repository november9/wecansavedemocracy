import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import CalendarPickerButtons from './calendarPickerButtons';

describe("CalendarPickerButtons", () => {
  it("should render 5 span elements", () => {
    const wrapper = shallow(<CalendarPickerButtons/>);
    expect(wrapper.find('span').length).to.equal(5);
  });
});

