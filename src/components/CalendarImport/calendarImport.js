import React, { Component } from 'react';
import { RaisedButton } from 'material-ui';

class CalendarImport extends Component {
  constructor (props) {
    super (props);

    this.state = {
      putOnCalendar: 'Add these actions to your calendar!'
    }
  }

  importToCalendar (userActivities) {
    console.log('userActivities from Import', userActivities);
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

export default CalendarImport;
