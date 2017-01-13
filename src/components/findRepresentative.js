import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { findReps, addUserActivity } from '../actions/index';
import { TextField } from 'redux-form-material-ui';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, CircularProgress, RaisedButton, Card, CardTitle, CardText } from 'material-ui';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import _ from 'lodash';
import FontIcon from 'material-ui/FontIcon';

let tempSelectedOfficials = [];

class FindRep extends Component {
  constructor(props) {
    super(props);

    const colors = {
      highlight: '#ff4081',
      highlight2: '#0097a7',
      highlight3: '#fff',
      headerBar: '#0097a7'
    }

    const style = {
      btnStyle: {
        margin: '5px 15px 0 0'
      },
      cardStyle: {
        paddingBottom: '25px'
      },
      addressField: {
        width: '100%'
      },
      loadingIconContainer: {
        textAlign: 'center',
        padding: '20px 0'
      },
      tableHeader: {
        paddingLeft: 0,
        fontSize: '18px'
      },
      tableDescription: {
        fontSize: '18px',
        margin: '0 16px',
        padding: '15px',
        backgroundColor: colors.headerBar,
        color: 'white',
        fontWeight: 'normal'
      },
      tableRow: {
        padding: '15px 0',
        lineHeight: '1.5'
      },
      tableRowColumn: {
        padding: '10px 0'
      },
      officialName: {
        color: colors.highlight,
        margin: '0 0 5px',
        fontSize: '125%'
      },
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
      addCancelBtns: {
        padding: '10px 0 0 16px'
      }
    }

    this.state = {
      cardTitleText: 'Find your local representative by entering your home address',
      submitBtnText: 'Search',
      addBtnText: 'Add these officials to your action',
      cancelBtnText: 'Cancel',
      addRepsToActionList: 'Add these representatives to your action list',
      zipFieldHintText: 'enter full home address',
      style,
      representativeData: {},
      isLoadingRepData: false,
      tempData: {},
      tableHeaderText: 'Please select the representatives you\'d like to contact',
      repSearchErrorMsg: 'Sorry, there were no representatives listed for this address. Can you please doublecheck the address and try again?',
      selectedOfficials: []
    };

    this.onRowSelection = this.onRowSelection.bind(this);
  }

  onRowSelection(rows) {
    switch (rows) {
      case 'all':
        tempSelectedOfficials = this.state.representativeData.officials;
        break;
      case 'none':
        tempSelectedOfficials = [];
      default:
        this.state.representativeData.officials.forEach((official, i) => {
          official.selected = rows.indexOf(i) > -1;
          if (official.selected === true) {
            tempSelectedOfficials.push(official);
          }
        });
    }

    this.setState({selectedOfficials: tempSelectedOfficials});
  }

  renderChannels(channels) {
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
              style={this.state.style.hyperLinks}>{channel.type}</a>
            <FontIcon
              className="material-icons"
              style={this.state.style.launchIcon}>launch</FontIcon>
          </div>
        )
      });
    }
  }

  renderUrls(urls) {
    if (urls) {
      return urls.map((url, key) => {
        return (
          <div key={key}>
            <a
              href={url}
              target="_blank"
              style={this.state.style.hyperLinks}>{url}</a>
            <FontIcon
              className="material-icons"
              style={this.state.style.launchIcon}>launch</FontIcon>
          </div>
        )
      });
    }
  }

  renderOfficialAddresses(addressInfo) {
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

  renderOfficialTitle(allData, officialKey) {
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
      <span style={this.state.style.officeName}>{officeName}</span>
    )
  }

  renderOfficialPhoneNumbers (phoneNumbers) {
    if (phoneNumbers) {
      return phoneNumbers.map((number, key) => {
        return (
          <div key={key} style={this.state.style.officialPhones}>
            {number}
          </div>
        )
      });
    }
  }

  renderOfficials(officialsData) {
    return officialsData.officials.map((data, key) => {
      if (data) {
        if (!data.party) {
          data.party = '(none given)';
        }

        return(
          <TableRow key={key} selected={data.selected}>
            <TableRowColumn style={this.state.style.tableRowColumn}>
              <h3 style={this.state.style.officialName}>{data.name}</h3>
              {this.renderOfficialTitle(officialsData, key)}
              {this.renderOfficialAddresses(data.address)}
              {this.renderOfficialPhoneNumbers(data.phones)}
              Party: <strong>{data.party}</strong>
              {this.renderUrls(data.urls)}
              {this.renderChannels(data.channels)}
            </TableRowColumn>
          </TableRow>
        )
      }
    });
  }

  renderRepList() {
    if (this.state.isLoadingRepData) {
      return (
        <div style={this.state.style.loadingIconContainer}>
          <CircularProgress />
        </div>
      )
    }

    if(this.state.representativeData === 'BAD') {
      return (
        <h3 style={this.state.style.tableDescription}>{this.state.repSearchErrorMsg}</h3>
      )
    }

    if (this.state.representativeData.hasOwnProperty('kind')) {
      const govtData = this.state.representativeData;

      return(
        <div>
          <h3 style={this.state.style.tableDescription}>
            Contact Info for Your Government Officials
          </h3>

          <Table
            multiSelectable={true}
            onRowSelection={this.onRowSelection}>
            <TableHeader>
              <TableRow>
                <TableHeaderColumn style={this.state.style.tableHeader}>
                  {this.state.tableHeaderText}
                </TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
              {this.renderOfficials(govtData)}
            </TableBody>
          </Table>

          <div style={this.state.style.addCancelBtns}>
            <RaisedButton
              label={this.state.addRepsToActionList}
              secondary={true}
              style={this.state.style.btnStyle}
              onClick={() => this.submitSelectedRepList()} />

            <RaisedButton
              label={this.state.cancelBtnText}
              primary={true}
              style={this.state.style.btnStyle}
              onClick={() => browserHistory.push('/actions/new')} />
          </div>
        </div>
      )
    }
  }

  submitSelectedRepList() {
    let selectedRepList = [];

    this.state.selectedOfficials.map((official, key) => {
      selectedRepList.push({
        officialName: official.name,
        officialTitle: this.renderOfficialTitle(this.state.representativeData, key),
        officialAddresses: this.renderOfficialAddresses(official.address),
        officialPhones: this.renderOfficialPhoneNumbers(official.phones),
        officialParty: official.party,
        officialUrls: this.renderUrls(official.urls),
        officialChannels: this.renderChannels(official.channels)
      });
    });

    const tempActivityData = this.props.tempActivityData;
    const activityDataWithReps = _.merge({}, tempActivityData, {
      selectedReps: selectedRepList
    });

    this.props.addUserActivity(activityDataWithReps)
  }

  // TODO: There is probably a much better way of doing this,
  // don't think I'm using Redux optimally here
  onSubmit(props) {
    this.setState({
      tempData: findReps(props.address),
      isLoadingRepData: true
    }, () => {
      return this.state.tempData.payload
      .then((response) => {
        this.setState({
          representativeData: response.data,
          isLoadingRepData: false
        });
      }).
      catch((err) => {
        this.setState({
          representativeData: 'BAD',
          isLoadingRepData: false
        });
      });
    })
  }

  render() {
    const { fields: { address }, handleSubmit } = this.props;

    return (
      <Card style={this.state.style.cardStyle}>
        <CardTitle title={this.state.cardTitleText}></CardTitle>
        <CardText>
          <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
            <Field
              name="address"
              component={TextField}
              hintText={this.state.zipFieldHintText}
              type="text"
              style={this.state.style.addressField}
              {...address}
            />
            <div>
              <RaisedButton
                label={this.state.submitBtnText}
                secondary={true}
                style={this.state.style.btnStyle}
                type="submit" />
              <RaisedButton
                label={this.state.cancelBtnText}
                primary={true}
                style={this.state.style.btnStyle}
                onClick={() => browserHistory.push('/actions/new')} />
            </div>
          </form>
        </CardText>

        {this.renderRepList(this.state.representativeData)}
      </Card>
    );
  }
}

function validate (values) {
  const errors = {};
  const requiredFields = [ 'address' ]
  requiredFields.forEach(field => {
    if(!values[field]) {
      errors[field] = 'This field is required.'
    }
  });

  return errors;
}

function mapStateToProps(state) {
  return {
    tempActivityData: state.userActivities.tempActivityData,
  }
};


const repSearchForm = reduxForm({
    form: 'FindRepForm',
    fields: [ 'address'  ],
    validate
})

export default connect(mapStateToProps, { addUserActivity })(repSearchForm(FindRep));
