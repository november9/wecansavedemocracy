import moment from 'moment';


const sortByDate = (list) => {
  let unformattedDate;

  console.log('list', list);
  if (list.length > 1) {
    if (_.has(list, 'acf.date')) {
      unformattedDate = list.acf.date
    } else {
      unformattedDate = moment().format('YYYY-MM-DD');
    }
  }
}

export default sortByDate;
