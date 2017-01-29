import axios from 'axios';
import _ from 'lodash';
import addLeadingZeros from '../utils/addLeadingZeros';
import sortByDate from '../utils/sortByDate';
import moment from 'moment';

export const FETCH_ACTIVITIES = 'FETCH_ACTIVITIES';
export const FETCH_ACTIVITY = 'FETCH_ACTIVITY';
export const DELETE_USER_ACTIVITIES = 'DELETE_USER_ACTIVITIES';
export const FETCH_CAUSES = 'FETCH_CAUSES';
export const FETCH_ACTIVITIES_FROM_CAUSES = 'FETCH_ACTIVITIES_FROM_CAUSES';
export const FETCH_USER_ACTIVITIES = 'FETCH_USER_ACTIVITIES';
export const ADD_USER_ACTIVITY = 'ADD_USER_ACTIVITY';
export const UPDATE_USER_ACTIVITY = 'UPDATE_USER_ACTIVITY';
export const FIND_REPS_FROM_API = 'FIND_REPS_FROM_API';
export const LOOK_FOR_REPS = 'LOOK_FOR_REPS';
export const CREATE_CALENDAR = 'CREATE_CALENDAR';
export const CREATE_EVENT = 'CREATE_EVENT';

const ROOT_URL = 'http://www.wecansavedemocracy.org/wp-json/wp/v2';
const FILTER = '?per_page=100';
const GOOGLE_CIVIC_API_ROOT_URL = 'https://www.googleapis.com/civicinfo/v2';
const GOOGLE_API_KEY = 'AIzaSyDzR0SxrSr1f-vrp0yPWVaDPqs1jx_lT5I';
const ADD_EVENT_ROOT_URL = 'https://www.addevent.com/api/v1/me/calendars';
const ADD_EVENT_API_KEY = 'ae.api25252_1484952331j2gGSe8pLxho';

export function fetchActivities() {
  const request = axios.get(`${ROOT_URL}/actions`);

  return {
    type: FETCH_ACTIVITIES,
    payload: request
  };
}

export function fetchCauses() {
  const request = axios.get(`${ROOT_URL}/causes${FILTER}`);

  return {
    type: FETCH_CAUSES,
    payload: request
  };
}

export function fetchActivity(id) {
  const request = axios.get(`${ROOT_URL}/actions/${id}`);

  return {
    type: FETCH_ACTIVITY,
    payload: request
  }
}

export function addUserActivity(selectedActivity) {
  return {
    type: ADD_USER_ACTIVITY,
    payload: selectedActivity
  }
}

export function lookForReps(selectedActivity) {
  return {
    type: LOOK_FOR_REPS,
    payload: selectedActivity
  }
}

export function fetchUserActivities (userActivities) {
  return {
    type: FETCH_USER_ACTIVITIES,
    payload: userActivities
  }
}

export function findReps(address) {
  const request = axios.get(`${GOOGLE_CIVIC_API_ROOT_URL}/representatives?key=${GOOGLE_API_KEY}&address=${address}`);

  return {
    type: FIND_REPS_FROM_API,
    payload: request
  }
}

export function deleteUserActivities(deletedActivities) {
  return {
    type: DELETE_USER_ACTIVITIES,
    payload: deletedActivities
  }
}

export function createCalendar(calendarTitle, calendarDescription) {
  const encodedCalendarTitle = encodeURIComponent(calendarTitle).replace(/%20/g,'+')
  const encodedCalendarDescription = encodeURIComponent(calendarDescription).replace(/%20/g,'+')

  const encodedEndpoint = encodeURI(`${ADD_EVENT_ROOT_URL}/create/?token=${ADD_EVENT_API_KEY}&title=${encodedCalendarTitle}&description=${encodedCalendarDescription}`);

  const request = axios.post(encodedEndpoint);

  return {
    type: CREATE_CALENDAR,
    payload: request
  }
}

export function createEvent(queryString, calendarId) {
  console.log(`${ADD_EVENT_ROOT_URL}/events/create?token=${ADD_EVENT_API_KEY}&calendar_id=${calendarId}&${queryString}`);
  console.log('calendarId', calendarId)
  const request = axios.post(`${ADD_EVENT_ROOT_URL}/events/create?token=${ADD_EVENT_API_KEY}&calendar_id=${calendarId}&${queryString}`);

  console.log('request', request);

  return {
    type: CREATE_EVENT,
    payload: request
  }
}
