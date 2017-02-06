import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import FontIcon from 'material-ui/FontIcon';

export const colors = {
  highlight: '#ff4081',
  highlight2: '#0097a7',
  highlight3: '#fff',
  headerBar: '#0097a7'
};

const style = {
  officialPhones: {
    padding: '0 0 5px'
  },
  officeName: {
    color: colors.highlight2,
    fontSize: '110%'
  },
  hyperLinks: {
    color: colors.highlight2
  },
  launchIcon: {
    color: colors.highlight3,
    fontSize: '14px',
    marginLeft: '5px'
  }
};

export function getChannels (channels) {
  let channelUrlList = [];

  if (channels) {
    channelUrlList = channels.map((channel, key) => {
      return channel;
    });
  }

  return channelUrlList;
}

export function renderChannels (channels) {
  let channelUrl;

  if (channels) {
    return getChannels(channels).map((channel, key) => {

      switch(channel.type) {
        case 'GooglePlus':
          channelUrl = `https://plus.google.com/${channel.id}`;
          break;
        case 'Facebook':
          channelUrl = `https://www.facebook.com/${channel.id}`;
          break;
        case 'Twitter':
          channelUrl = `https://twitter.com/${channel.id}`;
          break;
        case 'YouTube':
          channelUrl = `https://www.youtube.com/${channel.id}`;
          break;
      }

      return (
        <div key={key}>
          <a
            href={channelUrl}
            target="_blank"
            style={style.hyperLinks}>{channel.type}</a>
          <FontIcon
            className="material-icons"
            style={style.launchIcon}>launch</FontIcon>
        </div>
      );
    });
  }
}

export function getUrls(urls) {
  if (urls) {
    let urlList = [];

    urlList = urls.map((url, key) => {
      return url;
    });

    return urlList;
  }
}

export function renderUrls(urls) {
  if (urls) {
    return getUrls(urls).map((url, key) => {
      return (
        <div key={key}>
          <a
            href={url}
            target="_blank"
            style={style.hyperLinks}>{url}</a>
          <FontIcon
            className="material-icons"
            style={style.launchIcon}>launch</FontIcon>
        </div>
      );
    });
  }
}

export function getOfficialAddresses(addressInfo) {
  if (addressInfo) {
    let repOfficeAddresses = [];

    repOfficeAddresses = addressInfo.map((address, key) => {
      return address;
    });

    return repOfficeAddresses;
  }
}

export function renderOfficialAddresses(addressInfo) {
  if (addressInfo) {
    return getOfficialAddresses(addressInfo).map((address, key) => {
      return (
        <div className="official-address" key={key}>
          {address.line1},<br />
          {address.city}, {address.state}, {address.address}
        </div>
      );
    });
  }
}

export function renderOfficialTitle(allData, officialKey) {
  let officeName;

  _.each(allData.offices, (office, officeKey) => {
    return _.each(office.officialIndices, (indice, indiceKey) => {
      if(indice === officialKey) {
        officeName = office.name;
        return false;
      }
    });
  });

  return officeName;
}

export function getOfficialPhoneNumbers (phoneNumbers) {
  let phoneNumList = [];

  if (phoneNumbers) {
    phoneNumList = phoneNumbers.map((number, key) => {
      return number;
    });
  }

  return phoneNumList;
}

export function renderOfficialPhoneNumbers (phoneNumbers) {
    return getOfficialPhoneNumbers(phoneNumbers).map((number, key) => {
    return (
      <div key={key} style={style.officialPhones}>
        {number}
      </div>
    );
  });
}

export class RepInfoDisplay extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div>
        <h3 style={style.officialName}>{this.props.repData.name}</h3>
        <span style={style.officeName}>{renderOfficialTitle(this.props.officialsData, this.props.officialKey)}</span>
        {renderOfficialAddresses(this.props.repData.address)}
        {renderOfficialPhoneNumbers(this.props.repData.phones)}
        Party: <strong>{this.props.repData.party}</strong>
        {renderUrls(this.props.repData.urls)}
        {renderChannels(this.props.repData.channels)}
      </div>
    );
  }
}

RepInfoDisplay.propTypes = {
  repData: PropTypes.object.isRequired,
  officialsData: PropTypes.object.isRequired
};