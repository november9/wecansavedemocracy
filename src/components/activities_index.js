// PROCESS FOR CREATING A CONTAINER THAT CAN CALL ACTIVITY CREATORS
// 1) Import connect at top
// 2) Import activity creator
// 3) We define our mapDispatchToProps() function
// 4) And we connect it to our component

//import React from 'react';
import React, { Component } from 'react';
import _ from 'lodash';
import { Toolbar, ToolbarGroup, ToolbarTitle, RaisedButton, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import DateSelect from './DateSelect/dateSelect';
import TimeSelect from './TimeSelect/timeSelect';
import TimeCommitmentSelect from './TimeCommitmentSelect/timeCommitmentSelect';
import UserSelectedRepList from './UserSelectedRepList/userSelectedRepList';
import moment from 'moment';
import { fetchUserActivities } from '../actions/index';


const tableCellProps = {
  whiteSpace: 'inherit',
  textOverflow: 'inherit',
  width: 'auto'
}

const styles = {

  tableCell: tableCellProps,
  tableCellAlignTop: _.merge({}, tableCellProps, {
    verticalAlign: 'top',
    paddingTop: '15px'
  }),
  activityTitleCell: {
    whiteSpace: 'inherit',
    textOverflow: 'inherit',
    width: '50%',
    verticalAlign: 'top',
    paddingTop: '15px'
  },
  activityName: {
    fontSize: '20px'
  },
  activityTitleHeaderCell: {
    whiteSpace: 'inherit',
    textOverflow: 'inherit',
    width: '50%',
    paddingTop: '15px'
  },
  tableToolbar: {
    marginTop: '20px'
  },
  tableToolbarText: {
    color: 'white'
  },
  bottomActionBtn: {
    marginTop: '20px'
  },
  editLink: {
    cursor: 'pointer',
    textDecoration: 'underline'
  }
}

class ActivitiesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activities: this.props.activities,
      fixedHeader: true,
      fixedFooter: true,
      stripedRows: false,
      showRowHover: true,
      selectable: false,
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
      }
    };
  }

  toggleEditMode(activityRowKey) {
    if (this.state.indexOfEditedRow === null) {
      this.setState({
        indexOfEditedRow: activityRowKey
      });
    } else {
      // first make input fields go away...
      this.setState({
        indexOfEditedRow: null,
        activities: this.props.activities
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

  renderActivities(idx) {
    return this.state.activities.map((activity, key) => {
      if (!activity.hasOwnProperty('isInEditMode')) {
        _.merge(activity, {
          isInEditMode: false,
        });
      }

      return (
        <TableRow key={key}>
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
        <div>
          <Link to="/actions/new" className="btn btn-primary">
            <RaisedButton
              label="Add An Action"
              primary={true}
            />
          </Link>
        </div>

        <Toolbar style={this.state.bodyStyle.tableToolbar}>
          <ToolbarGroup>
            <ToolbarTitle
              text={this.state.toolbarTitle}
              style={this.state.bodyStyle.tableToolbarText}
            />
          </ToolbarGroup>
        </Toolbar>
        <Table
          height={this.state.height}
          fixedHeader={this.state.fixedHeader}
          fixedFooter={this.state.fixedFooter}
          selectable={this.state.selectable}
          multiSelectable={this.state.multiSelectable}
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
              label="Add An Action"
              primary={true}
            />
          </Link>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    activities: state.userActivities.all
  }
}
// a shortcut to avoid mapDispatchToProps()
export default connect(mapStateToProps, { fetchUserActivities })(ActivitiesList);
