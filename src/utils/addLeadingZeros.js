const addLeadingZeros = (num) => {
  if (num < 9) {
    return '0' + num;
  } else {
    return num;
  }
}

export default addLeadingZeros;
