import React, { Component } from 'react';
import { RaisedButton, Dialog } from 'material-ui';

const styles = {
  calendarDialog: {
    maxWidth: '300px',
    margin: '0 auto'
  }
}

const closeBtn = [
  <RaisedButton
    label="Close"
    primary={true}
    onTouchTap={this.handleClose}
  />
];

class UserSelectedRepList extends Component {
  constructor (props) {
    super(props);

    this.state = {
      calendarChoiceDialogOpen: false,
      calendarModalText: 'Please choose your calendar',
      closeBtn,
      styles
    }
  }
}
