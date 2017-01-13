import axios from 'axios';
import _ from 'lodash';
import addLeadingZeros from '../utils/addLeadingZeros';
import moment from 'moment';

export const FETCH_ACTIVITIES = 'FETCH_ACTIVITIES';
export const FETCH_ACTIVITY = 'FETCH_ACTIVITY';
export const DELETE_ACTIVITY = 'DELETE_ACTIVITY';
export const FETCH_CAUSES = 'FETCH_CAUSES';
export const FETCH_ACTIVITIES_FROM_CAUSES = 'FETCH_ACTIVITIES_FROM_CAUSES';
export const ADD_USER_ACTIVITY = 'ADD_USER_ACTIVITY';
export const UPDATE_USER_ACTIVITY = 'UPDATE_USER_ACTIVITY';
export const GET_UPDATED_ACTIVITY_DATA = 'GET_UPDATED_ACTIVITY_DATA';
export const FIND_REPS_FROM_API = 'FIND_REPS_FROM_API';
export const LOOK_FOR_REPS = 'LOOK_FOR_REPS';

const ROOT_URL = 'http://www.wecansavedemocracy.org/wp-json/wp/v2';
const FILTER = '?per_page=100';
const GOOGLE_CIVIC_API_ROOT_URL = 'https://www.googleapis.com/civicinfo/v2';
const GOOGLE_API_KEY = 'AIzaSyDzR0SxrSr1f-vrp0yPWVaDPqs1jx_lT5I';

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

export function updateUserActivity(userActivity, newVal, valIdentifier) {
  let unformattedDate;
  let finalDate;
  let finalTime;

  // here's where we convert the START DATE into a format where we can combine
  // it with the time and have moment.js convert it into ms for sorting purposes
  if (valIdentifier === 'startDate') {
    unformattedDate = newVal || userActivity.acf.date;
    finalDate = moment(unformattedDate).format('YYYY-MM-DD');
  } else {
    finalDate = moment().format('YYYY-MM-DD');
  }

  // here's where we convert the START TIME into a format where we can combine
  // it with the time and have moment.js convert it into ms for sorting purposes
  if (valIdentifier === 'startTime') {
    const originalHours = newVal.getHours();
    const convertedHours = ((originalHours + 11) % 12 + 1);
    const minutes = newVal.getMinutes();
    const amPm = originalHours >= 12 ? 'PM':'AM';

    // update the user activity with the newly selected start time in the
    // same format that the API gives out, so that it can be re-rendered properly
    // when we go back to the main action list
    userActivity.acf.start_hour = convertedHours;
    userActivity.acf.start_minute = addLeadingZeros(minutes);
    userActivity.acf.start_am_pm = amPm;
  }

  const hours = parseInt(userActivity.acf.start_hour) || 0;
  const minutes = parseInt(userActivity.acf.start_minute) || 0;
  const amPm = userActivity.acf.start_am_pm || 'AM';

  var militaryHours;
  if (amPm.toLowerCase() === 'pm') {
    if (hours === 12) {
      militaryHours = 0;
    } else {
      militaryHours = hours + 12;
    }
  } else {
    militaryHours = hours;
  }

  const convertedHours = addLeadingZeros(militaryHours);
  const convertedMinutes = addLeadingZeros(minutes);
  finalTime = convertedHours + ':' + convertedMinutes;

  let convertedDateTime = finalDate + ' ' + finalTime;
  let convertedByMoment = moment(convertedDateTime);
  let convertedToMilliseconds = moment(convertedByMoment).valueOf();

  userActivity.timeInMilliseconds = convertedToMilliseconds;

  return {
    type: UPDATE_USER_ACTIVITY,
    payload: userActivity
  }
}

export function getUpdatedActivityData() {
  return {
    type: GET_UPDATED_ACTIVITY_DATA,
    payload: null
  }
}

export function findReps(address) {
  const request = axios.get(`${GOOGLE_CIVIC_API_ROOT_URL}/representatives?key=${GOOGLE_API_KEY}&address=${address}`);

  return {
    type: FIND_REPS_FROM_API,
    payload: request
  }
}

export function deleteActivity(id) {
  const request = axios.delete(`${ROOT_URL}/actions/${id}${API_KEY}`);

  return {
    type: DELETE_ACTIVITY,
    payload: request
  }
}
