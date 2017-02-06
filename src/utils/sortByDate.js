import moment from 'moment';
import _ from 'lodash';
import addLeadingZeros from '../utils/addLeadingZeros';

const sortByDate = (list) => {

  if (_.isArray(list)) {
    let unformattedDate;
    let finalDate;
    let startTimeMins;
    let unformattedTime;
    let unsortedList;
    let militaryHours;
    let convertedToMilliseconds;

    unsortedList = _.forEach(list, (val, key) => {
      // convert date
      if (_.has(val, 'acf.date') && val.acf.date.length === 8) {
        unformattedDate = val.acf.date;
        finalDate = moment(unformattedDate);
      } else {
        finalDate = moment();
      }

      // convert time
      if (_.has(val, 'acf.start_hour') && _.has(val, 'acf.start_am_pm')) {
        startTimeMins = val.acf.start_minute || '00';

        unformattedTime = val.acf.start_hour + ':' + startTimeMins;

        if (val.acf.start_am_pm && val.acf.start_am_pm.toLowerCase() === 'pm') {
          if (val.acf.start_hour === 12) {
            militaryHours = 0;
          } else {
            militaryHours = val.acf.start_hour + 12;
          }
        } else {
          militaryHours = val.acf.start_hour;
        }

        finalDate.hours(militaryHours);
        finalDate.minutes(val.acf.start_minute);
      }


      convertedToMilliseconds = finalDate.valueOf();

      val.timeInMilliseconds = convertedToMilliseconds;
    });

    return _.sortBy(unsortedList, ['timeInMilliseconds']);
  } else {
    return [];
  }


};

export default sortByDate;
