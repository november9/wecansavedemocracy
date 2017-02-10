import React, { Component, PropTypes } from 'react';
import { RepInfoDisplay, renderChannels, renderUrls, renderEmailAddressList, renderOfficialAddresses, renderOfficialTitle, renderOfficialPhoneNumbers, colors } from '../../containers/FindRep/renderRepData';

const styles = {
  officialName: {
    color: colors.highlight,
    margin: '0 0 5px',
    fontSize: '125%'
  },
  list: {
    listStyleType: 'none',
    margin: 0,
    padding: 0
  },
  listItem: {
    borderTop: '1px solid #ccc',
    padding: '10px 0'
  },
  listItemHeader: {
    fontSize: '16px'
  }
};

class UserSelectedRepList extends Component {
  constructor (props) {
    super(props);
  }

  repListItems () {
    return this.props.activities[this.props.indexOfCurrentRow].filteredRepData.map((rep, key) => {

      return (
        <li
          key={key}
          style={styles.listItem}>
          <div>{rep.officialName}</div>
          <div>{rep.officialTitle}</div>
          {renderOfficialPhoneNumbers(rep.officialPhones)}
          Party: <strong>{rep.officialParty}</strong>
          {renderEmailAddressList(rep.officialEmails)}
          {renderUrls(rep.officialUrls)}
          {renderChannels(rep.officialChannels)}
        </li>
      );
    });
  }

  render () {
    if (!this.props.activities[this.props.indexOfCurrentRow].hasOwnProperty('filteredRepData')) {
      return null;
    }

    return (
      <ul
        style={styles.list}
      >
        {this.repListItems()}
      </ul>
    );
  }
}

UserSelectedRepList.propTypes = {
  activities: PropTypes.any,
  indexOfCurrentRow: PropTypes.any
};

export default UserSelectedRepList;
