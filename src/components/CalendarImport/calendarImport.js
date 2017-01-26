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
      calendarDescription: 'My action agenda for effecting political change!'
    }
  }

  this.addActivitiesToCalendar(userActivities, calendarId) {
    userActivities.forEach((val) => {
      this.props.createEvent(val, calendarId)
    });
  }

  importToCalendar () {
    console.log('this.props.calendar', this.props.calendar);
    if (this.props.calendar.data.calendar.id) {
      this.addActivitiesToCalendar(this.props.userActivities, this.props.calendar.data.calendar.id)
    }



    this.props.createCalendar(this.state.calendarTitle, this.state.calendarDescription).
    then((response) => {
      console.log('response.payload.data.calendar.id', response.payload.data.calendar.id);
    })
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
