import React, { Component } from 'react';
import _ from 'lodash';
import FontIcon from 'material-ui/FontIcon';

export const colors = {
  highlight: '#ff4081',
  highlight2: '#0097a7',
  highlight3: '#fff',
  headerBar: '#0097a7'
}

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
  },
}

export function renderChannels (channels) {
  let channelUrl;

  if (channels) {
    return channels.map((channel, key) => {

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
      )
    });
  }
}

export function renderUrls(urls) {
  if (urls) {
    return urls.map((url, key) => {
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
      )
    });
  }
}

export function renderOfficialAddresses(addressInfo) {
  if (addressInfo) {
    return addressInfo.map((address, key) => {
      return (
        <div className="official-address" key={key}>
          {address.line1},<br />
          {address.city}, {address.state}, {address.address}
        </div>
      )
    });
  }
}

export function renderOfficialTitle(allData, officialKey) {
  var officeName;

  _.each(allData.offices, (office, officeKey) => {
    return _.each(office.officialIndices, (indice, indiceKey) => {
      if(indice === officialKey) {
        officeName = office.name;
        return false;
      }
    });
  })

  return (
    <span style={style.officeName}>{officeName}</span>
  )
}

export function renderOfficialPhoneNumbers (phoneNumbers) {
  if (phoneNumbers) {
    return phoneNumbers.map((number, key) => {
      return (
        <div key={key} style={style.officialPhones}>
          {number}
        </div>
      )
    });
  }
}

export class RepInfoDisplay extends Component {
  constructor (props) {
    super(props);
  }

  render () {


    return (
      <div>
        <h3 style={style.officialName}>{this.props.repData.name}</h3>
        {renderOfficialTitle(this.props.officialsData, this.props.key)}
        {renderOfficialAddresses(this.props.repData.address)}
        {renderOfficialPhoneNumbers(this.props.repData.phones)}
        Party: <strong>{this.props.repData.party}</strong>
        {renderUrls(this.props.repData.urls)}
        {renderChannels(this.props.repData.channels)}
      </div>
    )
  }
}
