import React, { Component } from 'react';
import _ from 'lodash';
import { FlatButton, Toolbar, ToolbarGroup, ToolbarTitle, RaisedButton, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import DateSelect from './DateSelect/dateSelect';
import TimeSelect from './TimeSelect/timeSelect';
import TimeCommitmentSelect from './TimeCommitmentSelect/timeCommitmentSelect';
import UserSelectedRepList from './UserSelectedRepList/userSelectedRepList';
import moment from 'moment';
import { fetchUserActivities, deleteUserActivities } from '../actions/index';

const tableCellProps = {
  whiteSpace: 'inherit',
  textOverflow: 'inherit',
  width: 'auto'
}

const activityCellProps = {
  whiteSpace: 'inherit',
  textOverflow: 'inherit',
  width: '50%'
}

const styles = {
  tableCell: tableCellProps,
  tableCellAlignTop: _.merge({}, tableCellProps, {
    verticalAlign: 'top',
    paddingTop: '15px'
  }),
  activityTitleCell: _.merge({}, activityCellProps, {
    verticalAlign: 'top',
    paddingTop: '15px'
  }),
  activityName: {
    fontSize: '20px'
  },
  activityTitleHeaderCell: activityCellProps,
  tableToolbar: {
    marginTop: '20px'
  },
  tableToolbarText: {
    color: 'white'
  },
  bottomActionBtn: {
    marginTop: '20px'
  },
  addActionBtn: {
    float: 'right'
  },
  editLink: {
    cursor: 'pointer',
    textDecoration: 'underline'
  },
  deleteActionsBtnLabel: {
    fontSize: '10px'
  }
}

class ActivitiesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activities: this.props.activities,
      selectedActivities: [],
      fixedHeader: true,
      fixedFooter: true,
      stripedRows: false,
      showRowHover: true,
      selectable: true,
      multiSelectable: true,
      enableSelectAll: true,
      deselectOnClickaway: false,
      bodyStyle: styles,
      toolbarTitle: 'Your Action List',
      indexOfEditedRow: null,
      doneEditing: 'done editing',
      editing: 'edit action',
      tableHeader: {
        date: 'Date',
        time: 'Time',
        action: 'Action',
        timeCommitment: 'Time Commitment',
        editAction: 'Edit Action',
      },
      addActionBtnLabel: 'Add An Action',
      deleteActionsBtn: 'Delete Action(s)'
    };

    this.handleRowSelection = this.handleRowSelection.bind(this);
  }

  handleRowSelection(rows) {
    let selectedActivities = [];

    switch (rows) {
    case 'all':
      selectedActivities = this.state.activities;
      break;
    case 'none':
      selectedActivities = [];
      break;
    default:
      selectedActivities = [];
      this.state.activities.forEach((activity, i) => {
        activity.selected = rows.indexOf(i) > -1;
        if (activity.selected === true) {
          selectedActivities.push(activity);
        }
      });
    }

    this.setState({selectedActivities: selectedActivities});
  }

  toggleEditMode(activityRowKey) {
    if (this.state.indexOfEditedRow === null) {
      this.setState({
        indexOfEditedRow: activityRowKey
      });
    } else {
      // make input fields go away and refresh the activities...
      this.props.fetchUserActivities(this.props.activities);
      console.log('this.state.activities', this.state.activities);
      console.log('this.props.activities', this.props.activities);
      this.setState({
        indexOfEditedRow: null,
        //activities: this.state.activities,
      });
    }
  }

  toggleEditText(indexOfSelectedRow) {
    if (this.state.indexOfEditedRow === indexOfSelectedRow) {
      return (
        <span>{this.state.doneEditing}</span>
      );
    } else {
      return (
        <span>{this.state.editing}</span>
      );
    }
  }

  deleteActivities(selectedActivities) {
    let selectedActivitiesTemp = selectedActivities;
    this.props.deleteUserActivities(selectedActivitiesTemp);
    this.setState({
      activities: selectedActivitiesTemp
    }, () => this.handleRowSelection('none'));
  }

  renderActivities(idx) {
    console.log('RE-RENDERING!!', this.state.activities)
    return this.state.activities.map((activity, key) => {
      if (!activity.hasOwnProperty('isInEditMode')) {
        _.merge(activity, {
          isInEditMode: false,
        });
      }

      return (
        <TableRow
          key={key}
          selected={this.selected}>
          <TableRowColumn style={this.state.bodyStyle.tableCellAlignTop}>
            <DateSelect
              indexOfSelectedRow={key}
              indexOfEditedRow={idx}
              activities={this.state.activities}
              ref="dateSelect"
            />
          </TableRowColumn>
          <TableRowColumn style={this.state.bodyStyle.tableCellAlignTop}>
            <TimeSelect
              indexOfSelectedRow={key}
              indexOfEditedRow={idx}
              activities={this.state.activities}
            />
          </TableRowColumn>
          <TableRowColumn style={this.state.bodyStyle.activityTitleCell}>
            <strong style={this.state.bodyStyle.activityName} dangerouslySetInnerHTML={{ __html: activity.title.rendered }}></strong>
            <UserSelectedRepList
              indexOfCurrentRow={key}
              activities={this.state.activities}
            />
          </TableRowColumn>
          <TableRowColumn style={this.state.bodyStyle.tableCellAlignTop}>
            <TimeCommitmentSelect
              indexOfSelectedRow={key}
              indexOfEditedRow={idx}
              activities={this.state.activities}
            />
          </TableRowColumn>
          <TableRowColumn style={this.state.bodyStyle.tableCellAlignTop}>
            <a
              onClick={() => this.toggleEditMode(key)}
              style={this.state.bodyStyle.editLink}>
              {this.toggleEditText(key)}
            </a>
          </TableRowColumn>
        </TableRow>
      );
    });
  }

  render () {
    return(
      <div>
        <Toolbar style={this.state.bodyStyle.tableToolbar}>
          <ToolbarGroup>
            <ToolbarTitle
              text={this.state.toolbarTitle}
              style={this.state.bodyStyle.tableToolbarText}
            />

            <span className="addtocalendar atc-style-blue">
              <var className="atc_event">
                  <var className="atc_date_start">2014-05-04 12:00:00</var>
                  <var className="atc_date_end">2014-05-04 18:00:00</var>
                  <var className="atc_timezone">Europe/London</var>
                  <var className="atc_title">Star Wars Day Party</var>
                  <var className="atc_description">May the force be with you</var>
                  <var className="atc_location">Tatooine</var>
                  <var className="atc_organizer">Luke Skywalker</var>
                  <var className="atc_organizer_email">luke@starwars.com</var>
              </var>

              <var className="atc_event">
                  <var className="atc_date_start">2014-05-04 12:00:00</var>
                  <var className="atc_date_end">2014-05-04 18:00:00</var>
                  <var className="atc_timezone">Europe/London</var>
                  <var className="atc_title">Star Wars Day Party</var>
                  <var className="atc_description">May the force be with you</var>
                  <var className="atc_location">Tatooine</var>
                  <var className="atc_organizer">Luke Skywalker</var>
                  <var className="atc_organizer_email">luke@starwars.com</var>
              </var>
            </span>

          </ToolbarGroup>
          <ToolbarGroup>
            <RaisedButton
              label={this.state.deleteActionsBtn}
              default={true}
              labelStyle={this.state.bodyStyle.deleteActionsBtnLabel}
              onClick={() => {
                this.deleteActivities(this.state.selectedActivities)
              }}
              type="button"
            />

            <Link
              to="/actions/new"
              className="btn btn-primary">
              <RaisedButton
                label={this.state.addActionBtnLabel}
                primary={true}
              />
            </Link>
          </ToolbarGroup>
        </Toolbar>

        <Table
          height={this.state.height}
          fixedHeader={this.state.fixedHeader}
          fixedFooter={this.state.fixedFooter}
          selectable={this.state.selectable}
          multiSelectable={this.state.multiSelectable}
          onRowSelection={this.handleRowSelection}
        >
        <TableHeader
          displaySelectAll={this.state.showCheckboxes}
          adjustForCheckbox={this.state.showCheckboxes}
          enableSelectAll={this.state.enableSelectAll}
        >
            <TableRow>
              <TableHeaderColumn style={this.state.bodyStyle.tableCell}>
                {this.state.tableHeader.date}
              </TableHeaderColumn>
              <TableHeaderColumn style={this.state.bodyStyle.tableCell}>
                {this.state.tableHeader.time}
              </TableHeaderColumn>
              <TableHeaderColumn style={this.state.bodyStyle.activityTitleHeaderCell}>
                {this.state.tableHeader.action}
              </TableHeaderColumn>
              <TableHeaderColumn style={this.state.bodyStyle.tableCell}>
                {this.state.tableHeader.timeCommitment}
              </TableHeaderColumn>
              <TableHeaderColumn style={this.state.bodyStyle.tableCell}>
                {this.state.tableHeader.editAction}
              </TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}>
            {this.renderActivities(this.state.indexOfEditedRow)}
          </TableBody>
        </Table>

        <div style={styles.bottomActionBtn}>
          <Link to="/actions/new" className="btn btn-primary">
            <RaisedButton
              label={this.state.addActionBtnLabel}
              primary={true}
            />
          </Link>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log('state from mapStateToProps', state);
  return {
    activities: state.userActivities.all
  }
}
// a shortcut to avoid mapDispatchToProps()
export default connect(mapStateToProps, { fetchUserActivities, deleteUserActivities })(ActivitiesList);
