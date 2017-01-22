import React from 'react';

const styles = {
  list: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
  },
  listItem: {
    borderTop: '1px solid #ccc',
    padding: '10px 0'
  },
  listItemHeader: {
    fontSize: '16px'
  }
}

const UserSelectedRepList = (props) => {
  console.log('props', props);
  if (!props.activities[props.indexOfCurrentRow].hasOwnProperty('selectedReps')) {
    return null;
  }

  const repListItems = props.activities[props.indexOfCurrentRow].selectedReps.map((rep, key) =>
  {
    console.log('rep', rep);
    return (
      <li
        key={key}
        style={styles.listItem}>
        <div style={styles.listItemHeader}>{rep.officialName}</div>
        <div>
          {rep.officialTitle}<br />
          {rep.officialAddresses}
          {rep.officialPhones}
          {rep.officialParty}
          {rep.officialUrls}
          {rep.officialChannels}
        </div>
      </li>
    )
  });

  return (
    <ul
      style={styles.list}
    >
      {repListItems}
    </ul>
  )
}

export default UserSelectedRepList;
