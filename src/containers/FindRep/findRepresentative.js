import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { findReps, addUserActivity } from '../../actions/index';
import { TextField } from 'redux-form-material-ui';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, CircularProgress, RaisedButton, Card, CardTitle, CardText } from 'material-ui';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import _ from 'lodash';
import { RepInfoDisplay, getChannels, renderChannels, getUrls, renderUrls, getOfficialAddresses, renderOfficialAddresses, renderOfficialTitle, getOfficialPhoneNumbers, renderOfficialPhoneNumbers, colors } from './renderRepData';

const style = {
  officialName: {
    color: colors.highlight,
    margin: '0 0 5px',
    fontSize: '125%'
  },
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
  addCancelBtns: {
    padding: '10px 0 0 16px'
  }
}

let tempSelectedOfficials = [];

class FindRep extends Component {
  constructor(props) {
    super(props);

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

  renderOfficials(officialsData) {
    return officialsData.officials.map((data, key) => {
      officialsData.officials['tempIdx'] = key;

      if (data) {
        if (!data.party) {
          data.party = '(none given)';
        }

        return(
          <TableRow key={key} selected={data.selected}>
            <TableRowColumn style={style.tableRowColumn}>
              <RepInfoDisplay
                repData={data}
                officialKey={key}
                officialsData={officialsData}
                headerStyle={style.officialName}
              />
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

  // TODO: There is probably a much better way of doing this,
  // don't think I'm using Redux optimally here
  onSubmit(props) {
    this.setState({
      tempData: findReps(props.address),
      isLoadingRepData: true
    }, () => {
      return this.state.tempData.payload
      .then((response) => {
        // adding a unique index to each official in the list for deduping purposes
        // later on
        _.forEach(response.data.officials, (val, key) => {
          response.data.officials[key]['tempIdx'] = key;
        });

        this.setState({
          representativeData: response.data,
          isLoadingRepData: false
        });
      }).
      catch((err) => {
        console.log('err', err);
        this.setState({
          representativeData: 'BAD',
          isLoadingRepData: false
        });
      });
    })
  }

  submitSelectedRepList() {
    let selectedRepList = _.uniqBy(this.state.selectedOfficials, 'tempIdx');

    let filteredRepData = selectedRepList.map((val, key) => {
      return {
        officialName: val.name,
        officialTitle: renderOfficialTitle(this.state.representativeData, val.tempIdx),
        officialAddresses: getOfficialAddresses(val.address),
        officialPhones: getOfficialPhoneNumbers(val.phones),
        officialParty: val.party,
        officialUrls: val.urls,
        officialChannels: getChannels(val.channels)
      }
    });

    const tempActivityData = this.props.tempActivityData;

    // here we update the selected activity data with this new rep list
    const activityDataWithReps = _.merge({}, tempActivityData, {
      selectedRepList,
      filteredRepData
    });

    this.props.addUserActivity(activityDataWithReps);
    browserHistory.push('/');
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
