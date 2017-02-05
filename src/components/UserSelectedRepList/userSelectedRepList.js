import React, { Component } from 'react';
import { RepInfoDisplay, renderChannels, renderUrls, renderOfficialAddresses, renderOfficialTitle, renderOfficialPhoneNumbers, colors } from '../../containers/FindRep/renderRepData';

const styles = {
  officialName: {
    color: colors.highlight,
    margin: '0 0 5px',
    fontSize: '125%'
  },
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

class UserSelectedRepList extends Component {
  constructor (props) {
    super(props);

    console.log('props from UserSelectedRepList', props)
  }

  repListItems () {
    return this.props.activities[this.props.indexOfCurrentRow].filteredRepData.map((rep, key) => {

      return (
        <li
          key={key}
          style={styles.listItem}>
          <div style={styles.listItemHeader}>{rep.officialName}</div>
          <RepInfoDisplay
            repData={rep}
            officialKey={key}
            officialsData={this.props.activities}
          />
        </li>
      )
    });
  }

  render () {
    console.log('this.props.activities[this.props.indexOfCurrentRow]', this.props.activities[this.props.indexOfCurrentRow]);

    if (!this.props.activities[this.props.indexOfCurrentRow].hasOwnProperty('filteredRepData')) {
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


export default UserSelectedRepList;
