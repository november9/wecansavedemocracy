import React, { Component } from 'react';
import { TimePicker } from 'material-ui';
import Moment from 'react-moment';
import _ from 'lodash';
import addLeadingZeros from '../../utils/addLeadingZeros';
import { updateUserActivity } from '../../actions/index';
import { connect } from 'react-redux';

class TimeSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      indexOfSelectedRow: props.indexOfSelectedRow,
      indexOfEditedRow: props.indexOfEditedRow,
      activities: props.activities,
      customFields: props.activities[props.indexOfSelectedRow].acf,
      timePlaceholder: '(any time)',
      timePickerHint: 'select time',
      startTime: null,
    }
  }

  handleChangeTimepicker12 = (event, date) => {
    this.setState({startTime: date});
  };

  render() {
    const customFields = this.props.activities[this.props.indexOfSelectedRow].acf;
    let startTime;

    // if the user has selected at least a start hour and am/pm, then concatenate
    // the start hour values into a string
    if (
        _.every(['start_hour', 'start_am_pm'], _.partial(_.has, customFields)) &&
        this.state.startTime === null &&
        typeof customFields.start_am_pm === 'string'
      ) {

      startTime =
      customFields.start_hour + ':' +
      customFields.start_minute + ' ' +
      customFields.start_am_pm;
    }

    // if the current row is being edited, display the time picker
    if (this.props.indexOfEditedRow === this.state.indexOfSelectedRow) {
      return (
        <div>
          <TimePicker
            id={'tp-' + this.state.indexOfSelectedRow}
            format="ampm"
            hintText={this.state.timePickerHint}
            value={this.state.startTime}
            onChange={this.handleChangeTimepicker12} />
        </div>
      )
    } else {
      // if it's not being edited, just display either the
      // start time, if it exists...
      if (startTime || this.state.startTime) {
        // if we've already gotten the start time from the time picker,
        // then convert that time to the same format we're getting from the API
        if (this.state.startTime !== null) {

          // update the global state with the new start time value
          this.props.updateUserActivity(this.state.activities[this.state.indexOfSelectedRow], this.state.startTime, 'startTime')

          return (
            <span>
              <Moment format="h:mm a" date={this.state.startTime} />
            </span>
          );
        } else {
          // ...otherwise, just grab what's in the API
          return (
            <span>
              {startTime}
            </span>
          );
        }
        this.state.setState({ startTime: null });
      } else {
        //...or display the placeholder text for when no start time is selected
        return (
          <span>
            {this.state.timePlaceholder}
          </span>
        );
      }
    }
  }
}

//export default TimeSelect;
export default connect(null, { updateUserActivity })(TimeSelect);
