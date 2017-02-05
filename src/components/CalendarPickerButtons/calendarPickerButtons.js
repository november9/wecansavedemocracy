import React, { Component } from 'react';
import './css/theme3.css';

const styles = {
  CalendarPickerButtons: {
    maxWidth: '300px',
    margin: '0 auto'
  }
}

class CalendarPickerButtons extends Component {
  constructor (props) {
    super(props);

    this.state = {
      uniquekey: props.uniquekey
    }
  }

  triggerCalendarExport (calendarType) {
    const calendarUrl = 'http://addevent.com/subscribe/?' + this.state.uniquekey + '+' + calendarType;
    var win = window.open(calendarUrl, '_blank');
  }

  render() {
    return (
      <div className="calendarBtnContainer">
        <span
          className="ategoogle"
          id="addeventstc3-google"
          role="button"
          onClick={() => this.triggerCalendarExport('google')}>
            Google <em>(online)</em>
        </span>
        <span
          className="ateappleical"
          id="addeventstc3-appleical"
          role="button"
          onClick={() => this.triggerCalendarExport('appleical')}>
            Apple Calendar
        </span>
        <span className=
          "ateoutlook"
          id="addeventstc3-outlook"
          role="button"
          onClick={() => this.triggerCalendarExport('outlook')}>
            Outlook
          </span>
        <span
          className="ateoutlookcom"
          id="addeventstc3-outlookcom"
          role="button"
          onClick={() => this.triggerCalendarExport('outlookcom')}>
            Outlook.com <em>(online)</em>
        </span>
        <span
          className="ateyahoo"
          id="addeventstc3-yahoo"
          role="button"
          onClick={() => this.triggerCalendarExport('yahoo')}>
          Yahoo <em>(online)</em>
        </span>
      </div>
    )
  }
}
export default CalendarPickerButtons;
