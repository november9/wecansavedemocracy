import React, { Component } from 'react';
import { SelectField } from 'redux-form-material-ui';
import { connect } from 'react-redux';

class UsStateDropdown extends Component {


  state = {
    stateList: [
      'CA',
      'TX'
    ]
  }

  handleChange = (event) => {
    this.setState({
      value: event.target.value,
    });
  };

  render () {
    return (
      <SelectField
        value="state"
        onChange={this.handleChange}
        maxHeight={200}
      >
        {this.state.stateList}
      </SelectField>
    );
  }
}

export default connect(null, {})(UsStateDropdown);
