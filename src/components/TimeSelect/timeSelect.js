import React, { Component } from 'react';
import { TimePicker } from 'material-ui';
import Moment from 'react-moment';
import _ from 'lodash';
import addLeadingZeros from '../../utils/addLeadingZeros';
import { connect } from 'react-redux';
import { fetchUserActivities } from '../../actions/index';

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

  addLeadingZeros (num) {
    if (num < 9) {
      return '0' + num;
    } else {
      return num;
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
          // break new time down into pieces to correspond with activity object from API
          const hours = this.state.startTime.getHours();
          const convertedHours = ((hours + 11) % 12 + 1);
          const minutes = this.state.startTime.getMinutes();
          const amPm = hours >= 12 ? 'PM':'AM';

          // update the user activity with the newly selected start time
          this.props.activities[this.state.indexOfSelectedRow].acf.start_hour = convertedHours;
          this.props.activities[this.state.indexOfSelectedRow].acf.start_minute = addLeadingZeros(minutes);
          this.props.activities[this.state.indexOfSelectedRow].acf.start_am_pm = amPm;

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

function mapStateToProps(state) {
  return {
    activities: state.userActivities.all
  }
}
// a shortcut to avoid mapDispatchToProps()
export default connect(mapStateToProps, { fetchUserActivities })(TimeSelect);
//export default TimeSelect;
