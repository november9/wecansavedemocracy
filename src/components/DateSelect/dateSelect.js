import React, { Component } from 'react';
import { DatePicker } from 'material-ui';
import Moment from 'react-moment';
import { fetchUserActivities } from '../../actions/index';
import moment from 'moment';
import _ from 'lodash';
import { connect } from 'react-redux';

class DateSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      indexOfSelectedRow: props.indexOfSelectedRow,
      indexOfEditedRow: props.indexOfEditedRow,
      activities: props.activities,
      customFields: props.activities[props.indexOfSelectedRow].acf,
      datePlaceholder: '(any date)',
      startDate: null,
      datePickerHintText: 'select a date'
    }
  }

  handleDateChange = (event, date) => {
    this.setState({
      startDate: date,
    });
  };

  render() {
    let startDate;

    if (_.every(['date'], _.partial(_.has, this.state.customFields))) {
      startDate = this.state.customFields.date;
    }

    if (this.props.indexOfEditedRow === this.state.indexOfSelectedRow) {
      return (
        <div>
          <DatePicker
            id={'date-' + this.state.indexOfSelectedRow}
            hintText={this.state.datePickerHintText}
            value={this.state.startDate}
            onChange={this.handleDateChange} />
        </div>
      )
    } else {
      if (startDate || this.state.startDate !== null) {

        if (this.state.startDate !== null) {
          startDate = this.state.startDate;
        }



        // save the new value to the global state
        this.props.activities[this.state.indexOfSelectedRow].acf.date = moment(startDate).format('YYYYMMDD');
        // console.log('startDate', startDate);
        // _.sortBy(this.props.activities, this.state.startDate.getTime())

        console.log('here is the this.props.activities[this.state.indexOfSelectedRow].acf.date date from the dateSelect', this.props.activities[this.state.indexOfSelectedRow].acf.date);
        this.props.fetchUserActivities(this.props.activities);

        return (
          <span>
            <Moment
              format="MM/DD/YYYY"
              date={startDate}
            />
          </span>
        )

        this.state.setState({ startDate: null });
      } else {
        //...or display the placeholder text for when no start date is selected
        return (
          <span>
            {this.state.datePlaceholder}
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
export default connect(mapStateToProps, { fetchUserActivities })(DateSelect);
