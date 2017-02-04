import React, { Component } from 'react';
import { RaisedButton, Dialog } from 'material-ui';
import { createCalendar, createEvent, fetchCalendarEvents, deleteEvent } from '../../actions/index';
import { connect } from 'react-redux';
import addLeadingZeros from '../../utils/addLeadingZeros';
import convertHtmlSymbols from '../../utils/convertHtmlSymbols';
import moment from 'moment';
import striptags from 'striptags';
import CalendarPickerButtons from '../CalendarPickerButtons/calendarPickerButtons';

const styles = {
  calendarDialog: {
    maxWidth: '300px',
    margin: '0 auto'
  }
}

class CalendarImport extends Component {
  constructor (props) {
    super (props);

    const closeBtn = [
      <RaisedButton
        label="Close"
        primary={true}
        onTouchTap={this.handleClose}
      />
    ];

    function getUniqueKey () {
      if (this.state.uniquekey) {
        return this.props.calendar.data.calendar.uniquekey;
      } else {
        return null;
      }
    }

    this.state = {
      putOnCalendar: 'Add these actions to your calendar!',
      calendarTitle: 'Democracy Action Agenda',
      calendarDescription: 'My action agenda for effecting political change!',
      calendarNoLocation: 'anywhere!',
      calendarChoiceDialogOpen: false,
      calendarModalText: 'Please choose your calendar',
      closeBtn,
      styles,
      uniquekey: null,
      disableImportBtn: this.disableImportBtn(),
      calendarData: this.props.calendar
    }
  }

  disableImportBtn () {
    if (this.props.userActivities.length > 0) {
      console.log('it is true');
      return false;
    } else {
      console.log('it is false');
      return true;
    }
  }

  generateCalendarEventQueryStr(userActivity) {
    let isAllDayEvent = false;

    let streetAddressProperties = [
      userActivity.acf.street_address_1,
      userActivity.acf.street_address_2,
      userActivity.acf.city,
      userActivity.acf.state,
      userActivity.acf.zip
    ];

    function generateStringVal (arrayOfStrings) {
      let currString = '';
      let stringArr = [];

      arrayOfStrings.forEach((val, key) => {
        currString = '';
        if (val && typeof val === 'string' && val.length >= 2) {
          currString = ((key > 0 && key !== (arrayOfStrings.length - 1)) ? ', ' : '') + val;
          currString = convertHtmlSymbols(currString);
          stringArr.push(currString);
        }
      });

      return stringArr.join('');
    }

    // TODO: make this dynamic so we can make it a fallback? Not using for now, getting
    // this data from the API for now.
    function getTimezoneByLocation () {
      // should be API call to https://www.addevent.com/api/v1/timezones
      return 'America/Chicago'
    }

    function getStartDateTime () {
      // return current date/time if there is no timeInMilliseconds property
      if (userActivity.timeInMilliseconds && typeof userActivity.timeInMilliseconds === 'number' && userActivity.acf.date && userActivity.acf.date.length) {
        isAllDayEvent = false;
        return moment(userActivity.timeInMilliseconds).format('MM/DD/YYYY HH:mm');
      } else {
        isAllDayEvent = true;
        return moment().format('MM/DD/YYYY 00:00');
      }
    }

    const descNoHtml = striptags(userActivity.content.rendered + 'test\n' + 'a new line\n' + 'yet another line');
    console.log('descNoHtml', descNoHtml);
    const descAddSpaceBetweenParagraph = descNoHtml.replace(/\./g,'. ');

    const title = encodeURIComponent(userActivity.title.rendered).replace(/%20/g,'+');
    const description = encodeURIComponent(descAddSpaceBetweenParagraph).replace(/%20/g,'+');
    const location = encodeURIComponent(generateStringVal(streetAddressProperties)).replace(/%20/g,'+');
    const timezone = encodeURIComponent(userActivity.acf.timezone);
    const start_date = encodeURIComponent(getStartDateTime());
    const all_day_event = isAllDayEvent;

    return 'title=' + title + '&description=' + description + '&location=' + location + '&timezone=' + timezone + '&start_date=' + start_date + '&all_day_event=' + all_day_event;
  }

  handleOpen = () => {
    console.log('this.props', this.props);

    this.setState({
      calendarChoiceDialogOpen: true,
      uniquekey: this.props.calendar.calendar.data.calendar.uniquekey
    });
  };

  handleClose = () => {
    this.setState({calendarChoiceDialogOpen: false});
  };

  addActivitiesToCalendar(userActivities, calendarId, calendarAlreadyExists) {
    this.props.fetchCalendarEvents(calendarId).then((response) => {
      // if there is already a calendar...
      if (calendarAlreadyExists && _.has(response, 'payload.data.events')) {
        // ...first delete all of the events so that we're starting with
        // a clean slate and won't have duplicates
        response.payload.data.events.forEach((val) => {
          this.props.deleteEvent(val.id);
        });
      }
    }).then(() => {
      userActivities.forEach((val) => {
        // generate a query string
        const queryString = this.generateCalendarEventQueryStr(val);
        //add user events to calendar
        this.props.createEvent(queryString, calendarId);
      });
    });

    this.handleOpen();
  }

  importToCalendar () {
    // if there is a calendar, then just add the events...
    if (_.has(this.props.calendar, 'data.calendar.id') && this.props.calendar.data.calendar.id) {
      this.addActivitiesToCalendar(this.props.userActivities, this.props.calendar.data.calendar.id, true);
    } else {
      // if there is no calendar, then create the calendar first, and THEN add the events
      this.props.createCalendar(this.state.calendarTitle, this.state.calendarDescription).
      then((response) => {
        this.addActivitiesToCalendar(this.props.userActivities, response.payload.data.calendar.id);
      })
    }
  }

  renderCalenderButtons() {
    if (this.state.uniquekey) {
      return (
        <CalendarPickerButtons
          uniquekey={this.state.uniquekey}
        />
      )
    }
  }

  render () {
    return (
      <div>
        <RaisedButton
          label={this.state.putOnCalendar}
          default={true}
          onClick={() => {
            this.importToCalendar(this.props.userActivities);
          }}
          type="button"
          disabled={this.disableImportBtn()}
        />

        <Dialog
          actions={this.state.closeBtn}
          modal={true}
          open={this.state.calendarChoiceDialogOpen}
          contentStyle={this.state.styles.calendarDialog}
        >
          <h3>{this.state.calendarModalText}</h3>

          {this.renderCalenderButtons()}

        </Dialog>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    calendar: state.calendar
  }
}

export default connect(mapStateToProps, { fetchCalendarEvents, createCalendar, createEvent, deleteEvent })(CalendarImport);
