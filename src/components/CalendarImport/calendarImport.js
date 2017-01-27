import React, { Component } from 'react';
import { RaisedButton } from 'material-ui';
import { createCalendar, createEvent } from '../../actions/index';
import { connect } from 'react-redux';

class CalendarImport extends Component {
  constructor (props) {
    super (props);

    this.state = {
      putOnCalendar: 'Add these actions to your calendar!',
      calendarTitle: 'Democracy Action Agenda',
      calendarDescription: 'My action agenda for effecting political change!',
      calendarNoLocation: 'anywhere!'
    }
  }

  convertUserActivityToCalendarEvent(userActivity) {

    console.log('userActivity', userActivity);

    let streetAddressProperties = [
      userActivity.acf.street_address_1,
      userActivity.acf.street_address_2,
      userActivity.acf.city,
      userActivity.acf.state,
      userActivity.acf.zip
    ];


    function generateStringVal (arrayOfStrings) {
      let currString = '';
      let stringArr = [];

      arrayOfStrings.forEach((val, key) => {
        currString = '';
        if (val && typeof val === 'string' && val.length >= 2) {
          currString = ((key > 0 && key !== (arrayOfStrings.length - 1)) ? ', ' : '') + val;
          stringArr.push(currString);
        }
      });

      return stringArr.join('');
    }

    const urlString = {
      title: userActivity.title.rendered,
      description: userActivity.content.rendered,
      location: generateStringVal(streetAddressProperties)
    }

    console.log('urlString', urlString);

  }

  addActivitiesToCalendar(userActivities, calendarId) {
    userActivities.forEach((val) => {
      this.convertUserActivityToCalendarEvent(val);
      //this.props.createEvent(val, calendarId)
    });
  }

  importToCalendar () {
    console.log('this.props.calendar', this.props.calendar);
    if (this.props.calendar.data.calendar.id) {
      this.addActivitiesToCalendar(this.props.userActivities, this.props.calendar.data.calendar.id)
    } else {
      this.props.createCalendar(this.state.calendarTitle, this.state.calendarDescription).
      then((response) => {
        console.log('response.payload.data.calendar.id', response.payload.data.calendar.id);
      })
    }
  }

  render () {
    return (
      <RaisedButton
        label={this.state.putOnCalendar}
        default={true}
        onClick={() => {
          this.importToCalendar(this.props.userActivities);
        }}
        type="button"
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    calendar: state.calendar.calendar
  }
}

export default connect(mapStateToProps, { /*getCalendar,*/ createCalendar, createEvent })(CalendarImport);
