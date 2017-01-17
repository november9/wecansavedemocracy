import axios from 'axios';
import _ from 'lodash';
import addLeadingZeros from '../utils/addLeadingZeros';
import moment from 'moment';

export const FETCH_ACTIVITIES = 'FETCH_ACTIVITIES';
export const FETCH_ACTIVITY = 'FETCH_ACTIVITY';
export const DELETE_ACTIVITY = 'DELETE_ACTIVITY';
export const FETCH_CAUSES = 'FETCH_CAUSES';
export const FETCH_ACTIVITIES_FROM_CAUSES = 'FETCH_ACTIVITIES_FROM_CAUSES';
export const FETCH_USER_ACTIVITIES = 'FETCH_USER_ACTIVITIES';
export const ADD_USER_ACTIVITY = 'ADD_USER_ACTIVITY';
export const UPDATE_USER_ACTIVITY = 'UPDATE_USER_ACTIVITY';
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

export function fetchUserActivities () {
  return {
    type: FETCH_USER_ACTIVITIES,
    payload: null,
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
