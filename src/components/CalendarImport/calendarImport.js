import React, { Component } from 'react';
import { RaisedButton, Dialog } from 'material-ui';
import { createCalendar, createEvent, fetchCalendarEvents } from '../../actions/index';
import { connect } from 'react-redux';
import addLeadingZeros from '../../utils/addLeadingZeros';
import convertHtmlSymbols from '../../utils/convertHtmlSymbols';
import moment from 'moment';
import striptags from 'striptags';
import './css/theme3.css';

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

    this.state = {
      putOnCalendar: 'Add these actions to your calendar!',
      calendarTitle: 'Democracy Action Agenda',
      calendarDescription: 'My action agenda for effecting political change!',
      calendarNoLocation: 'anywhere!',
      calendarChoiceDialogOpen: false,
      calendarModalText: 'Please choose your calendar',
      closeBtn
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
      // timezone list here: https://www.addevent.com/zones, for now going to
      // hard-code this for dev purposes
      // or better yet, API call to here: https://www.addevent.com/api/v1/timezones
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
    this.setState({calendarChoiceDialogOpen: true});
  };

  handleClose = () => {
    this.setState({calendarChoiceDialogOpen: false});
  };

  triggerCalendarExport (calendarType) {
    console.log('this.props.calendar.data.calendar.uniquekey', this.props.calendar.data.calendar.uniquekey);
    const calendarUrl = 'http://addevent.com/subscribe/?' + this.props.calendar.data.calendar.uniquekey + '+' + calendarType;
    var win = window.open(calendarUrl, '_blank');
  }

  addActivitiesToCalendar(userActivities, calendarId) {
    // get list of calendar events
    const eventList = this.props.fetchCalendarEvents(calendarId);
    console.log('eventList', eventList);

    // if you know the eventId you can save

    // but how do you check if it's an existing calendar event?

    // for each user activity...
    userActivities.forEach((val) => {
      // generate a query string
      const queryString = this.generateCalendarEventQueryStr(val);
      this.props.createEvent(queryString, calendarId);
    });

    this.handleOpen();
  }

  importToCalendar () {
    if (_.has(this.props, 'calendar.data.calendar.id') && this.props.calendar.data.calendar.id) {
      this.addActivitiesToCalendar(this.props.userActivities, this.props.calendar.data.calendar.id);
    } else {
      this.props.createCalendar(this.state.calendarTitle, this.state.calendarDescription).
      then((response) => {
        this.addActivitiesToCalendar(this.props.userActivities, response.payload.data.calendar.id);
      })
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
      />

      <Dialog
        actions={this.state.closeBtn}
        modal={true}
        open={this.state.calendarChoiceDialogOpen}
      >
        <h3>{this.state.calendarModalText}</h3>

        <span
          className="addeventstc_dropdown c1"
          aria-hidden="false"
          style={{display: 'block'}}>

          <span
            className="ateappleical"
            id= "addeventstc3-appleical"
            role="button">
              Apple Calendar
          </span>
          <span
            className="ategoogle"
            id="addeventstc3-google"
            role="button">
              Google <em>(online)</em>
          </span>
          <span className=
            "ateoutlook"
            id="addeventstc3-outlook"
            role="button">
              Outlook
            </span>
          <span
            className="ateoutlookcom"
            id="addeventstc3-outlookcom"
            role="button">
              Outlook.com <em>(online)</em>
          </span>
          <span
            className="ateyahoo"
            id="addeventstc3-yahoo"
            role="button">
            Yahoo <em>(online)</em>
          </span>
        </span>
      </Dialog>
      </div>

    )
  }
}

function mapStateToProps(state) {
  return {
    calendar: state.calendar.calendar
  }
}

export default connect(mapStateToProps, { fetchCalendarEvents, createCalendar, createEvent })(CalendarImport);
