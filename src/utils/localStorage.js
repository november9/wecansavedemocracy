export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      console.log('loadState undefined');
      return undefined;
    }

    return JSON.parse(serializedState);
  } catch (err) {
    console.log('err from loadState', err);

    return undefined;
  }
}

export const saveState = (state) => {
  console.log('state', state);
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (err) {
    console.log('err from saveState', err);
    // ignore write error
  }
}
