import React, { Component, PropTypes } from 'react';
import { SelectField, MenuItem } from 'material-ui';
import Moment from 'react-moment';
import _ from 'lodash';

const timeCommitmentPlaceholder = '(none specified)';
const timeCommitmentOptions = [
  {
    mins: null,
    label: '(none specified)'
  }, {
    mins: 5,
    label: '5 minutes or less'
  }, {
    mins: 15,
    label: '15 minutes'
  }, {
    mins: 30,
    label: '30 minutes'
  }, {
    mins: 60,
    label: '1 hour'
  }, {
    mins: 120,
    label: '2 hours'
  }, {
    mins: 360,
    label: '4 hours'
  }, {
    mins: 1440,
    label: '1 day'
  }, {
    mins: 2880,
    label: '2 days'
  }, {
    mins: 4320,
    label: '3 days'
  }, {
    mins: 7200,
    label: '5 days'
  }, {
    mins: 10080,
    label: '1 week'
  }, {
    mins: 20160,
    label: '2 weeks'
  }, {
    mins: 40320,
    label: '1 month or more'
  }
];

class TimeCommitmentSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      indexOfSelectedRow: props.indexOfSelectedRow,
      indexOfEditedRow: props.indexOfEditedRow,
      activities: props.activities,
      customFields: props.activities[props.indexOfSelectedRow].acf,
      timeCommitmentHint: 'select time commitment',
      timeCommitmentVal: null,
      timeCommitmentPlaceholder
    };

    this.handleTimeCommitmentChange = this.handleTimeCommitmentChange.bind(this);
  }

  generateTimeCommitmentOptions() {
    return timeCommitmentOptions.map((timeCommitment, key) => {
      return (
        <MenuItem
          key={key}
          value={timeCommitment.mins}
          primaryText={timeCommitment.label}/>
      );
    });
  }

  handleTimeCommitmentChange(event, index, value) {
    this.setState({timeCommitmentVal: value});
  }

  render() {
    const customFields = this.props.activities[this.state.indexOfSelectedRow].acf;
    let timeCommitment;
    let timeCommitmentLabel;

    if (customFields.hasOwnProperty('time_commitment')) {
      timeCommitment = customFields.time_commitment;
    }

    if (this.props.indexOfEditedRow === this.state.indexOfSelectedRow) {
      return (
        <div>
          <SelectField
            id={'tc-' + this.state.indexOfSelectedRow}
            value={this.state.timeCommitmentVal}
            onChange={this.handleTimeCommitmentChange}>
            {this.generateTimeCommitmentOptions(this.state.timeCommitmentVal)}
          </SelectField>
        </div>
      );
    } else {
      if (timeCommitment || this.state.timeCommitmentVal !== null) {
        if (this.state.timeCommitmentVal) {
          timeCommitment = this.state.timeCommitmentVal;
        }

        timeCommitmentLabel = _.find(timeCommitmentOptions, (val, key) => {
          return val.mins == timeCommitment;
        }).label;

        // save the new value to the global state
        this.props.activities[this.state.indexOfSelectedRow].acf.time_commitment = timeCommitment;

        // ...otherwise, just grab what's in the API
        return (
          <span>
            {timeCommitmentLabel}
          </span>
        );
      } else {
        return (
          <span>
            {this.state.timeCommitmentPlaceholder}
          </span>
        );
      }
    }
  }
}

TimeCommitmentSelect.propTypes = {
  indexOfSelectedRow: PropTypes.number,
  indexOfEditedRow: PropTypes.number,
  activities: PropTypes.array
};

export default TimeCommitmentSelect;
