import React, { Component } from 'react';
import { RaisedButton } from 'material-ui';
import { createCalendar, createEvent } from '../../actions/index';
import { connect } from 'react-redux';
import addLeadingZeros from '../../utils/addLeadingZeros';
import convertHtmlSymbols from '../../utils/convertHtmlSymbols';
import moment from 'moment';
import striptags from 'striptags';

class CalendarImport extends Component {
  constructor (props) {
    super (props);

    this.state = {
      putOnCalendar: 'Add these actions to your calendar!',
      calendarTitle: 'Democracy Action Agenda',
      calendarDescription: 'My action agenda for effecting political change!',
      calendarNoLocation: 'anywhere!'
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

    function getTimezoneByLocation () {
      // timezone list here: https://www.addevent.com/zones, for now going to
      // hard-code this for dev purposes
      return 'America/Chicago'
    }

    function getStartDateTime () {
      // return current date/time if there is no timeInMilliseconds property
      if (userActivity.timeInMilliseconds && typeof userActivity.timeInMilliseconds === 'number' && userActivity.acf.date.length) {
        isAllDayEvent = false;
        return moment(userActivity.timeInMilliseconds).format('MM/DD/YYYY HH:mm');
      } else {
        isAllDayEvent = true;
        return moment().format('MM/DD/YYYY 00:00');
      }
    }

    const descNoHtml = striptags(userActivity.content.rendered);
    const descAddSpaceBetweenParagraph = descNoHtml.replace(/\./g,'. ');

    const title = encodeURIComponent(userActivity.title.rendered).replace(/%20/g,'+');
    const description = encodeURIComponent(descAddSpaceBetweenParagraph).replace(/%20/g,'+');
    const location = encodeURIComponent(generateStringVal(streetAddressProperties)).replace(/%20/g,'+');
    const timezone = getTimezoneByLocation();
    const start_date = encodeURIComponent(getStartDateTime());
    const all_day_event = isAllDayEvent;

    return 'title=' + title + '&description=' + description + '&location=' + location + '&timezone=' + timezone + '&start_date=' + start_date + '&all_day_event=' + all_day_event;

  }

  addActivitiesToCalendar(userActivities, calendarId) {
    userActivities.forEach((val) => {
      const queryString = this.generateCalendarEventQueryStr(val);
      this.props.createEvent(queryString, calendarId)
    });
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

function mapStateToProps(state) {
  return {
    calendar: state.calendar.calendar
  }
}

export default connect(mapStateToProps, { /*getCalendar,*/ createCalendar, createEvent })(CalendarImport);
