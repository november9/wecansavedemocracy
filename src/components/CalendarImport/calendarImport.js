import React, { Component } from 'react';
import { RaisedButton } from 'material-ui';
import { createCalendar } from '../../actions/index';
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

  importToCalendar () {
    this.props.createCalendar(this.state.calendarTitle, this.state.calendarDescription).
    then((response) => {
      console.log('response', response);
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

export default connect(mapStateToProps, { createCalendar })(CalendarImport);
