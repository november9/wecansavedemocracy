const addLeadingZeros = (num) => {
  const parsedAsNum = parseInt(num);

  if (num <= parsedAsNum) {
    return '0' + num;
  } else {
    return num;
  }
};

export default addLeadingZeros;
