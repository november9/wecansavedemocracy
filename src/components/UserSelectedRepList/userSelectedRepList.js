import React, { Component } from 'react';

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

class RepData extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div>
        stuff
      </div>
    )
  }

}

class UserSelectedRepList extends Component {
  constructor (props) {
    super(props);
  }

  renderIndivReps (repObj, key) {
    return (
      <li
        key={key}
        style={styles.listItem}>
        <div style={styles.listItemHeader}>{repObj.officialName}</div>
        <div>
          hello
        </div>
      </li>
    )
  }

  repListItems () {
    console.log('this.props.activities[this.props.indexOfCurrentRow].selectedReps', this.props.activities[this.props.indexOfCurrentRow].selectedReps);
    return this.props.activities[this.props.indexOfCurrentRow].selectedReps.map((rep, key) => {

      return (
        <li
          key={key}
          style={styles.listItem}>
          <div style={styles.listItemHeader}>{rep.officialName}</div>
          <RepData key={key} repObj={rep} />
        </li>
      )
    });
  }

  render () {
    if (!this.props.activities[this.props.indexOfCurrentRow].hasOwnProperty('selectedReps')) {
      return null;
    }

    return (
      <ul
        style={styles.list}
      >
        {this.repListItems()}
      </ul>
    )
  }
}


//export default connect(mapStateTothis.props, {})(IndividualActivity);

export default UserSelectedRepList;
