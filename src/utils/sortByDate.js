import moment from 'moment';
import addLeadingZeros from '../utils/addLeadingZeros';

const sortByDate = (list) => {


  if (_.isArray(list)) {
    let unformattedDate;
    let finalDate;
    let startTimeMins;
    let unformattedTime;
    let finalTime;
    let unsortedList;
    let dateToday = moment().format('YYYY-MM-DD');
    let militaryHours;
    let convertedHours;
    let convertedMinutes;
    let convertedDateTime;
    let convertedByMoment;
    let convertedToMilliseconds;



    unsortedList = _.forEach(list, (val, key) => {
      // convert date
      if (_.has(val, 'acf.date')) {

        unformattedDate = val.acf.date;
        finalDate = moment(unformattedDate).format('YYYY-MM-DD');
      } else {
        finalDate = dateToday;
      }

      // convert time
      if (_.has(val, 'acf.start_hour') && _.has(val, 'acf.start_am_pm')) {
        startTimeMins = val.acf.start_minute || '00';

        unformattedTime = val.acf.start_hour + ':' + startTimeMins;

        if (val.acf.start_am_pm.toLowerCase() === 'pm') {
          if (val.acf.start_hour === 12) {
            militaryHours = 0;
          } else {
            militaryHours = val.acf.start_hour + 12;
          }
        } else {
          militaryHours = val.acf.start_hour;
        }

        convertedHours = addLeadingZeros(militaryHours);

        finalTime = convertedHours + ':' + val.acf.start_minute;
      } else {
        finalTime = '00:00'
      }

      convertedDateTime = finalDate + ' ' + finalTime;
      convertedByMoment = moment(convertedDateTime).format('YYYY-MM-DD HH:mm');
      convertedToMilliseconds = moment(convertedByMoment).valueOf();

      val.timeInMilliseconds = convertedToMilliseconds;
      console.log('val.timeInMilliseconds', val.timeInMilliseconds);
      console.log('convertedDateTime', convertedDateTime);

    });

    return _.sortBy(unsortedList, 'timeInMilliseconds');

  } else {
    return [];
  }


}

export default sortByDate;
