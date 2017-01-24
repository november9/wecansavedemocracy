// PROCESS FOR CREATING A CONTAINER THAT CAN CALL ACTIVITY CREATORS
// 1) Import connect at top
// 2) Import activity creator
// 3) We define our mapDispatchToProps() function
// 4) And we connect it to our component

//import React from 'react';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import {CircularProgress, GridList, GridTile, Card, CardTitle, CardText, Checkbox, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, RaisedButton} from 'material-ui';
import { connect } from 'react-redux';
import { fetchCauses, fetchActivities, fetchActivity } from '../../actions/index';
import { Link } from 'react-router';
import IndividualActivity from '../ActivitiesList/individual_activity';

let selectedCauses = [];
let selectedActivities = [];

const styles = {
  table: {
    backgroundColor: 'none'
  },
  tableCell: {
    whiteSpace: 'inherit',
    textOverflow: 'inherit',
    width: 'auto'
  },
  ActivityTitleCell: {
    whiteSpace: 'inherit',
    textOverflow: 'inherit',
    width: '50%'
  },
  checkBoxSection: {
    marginBottom: '20px'
  },
  checkBoxContainers: {
    paddingBottom: '40px !important'
  },
  activitySearchBtn: {
    marginBottom: '20px'
  },
  activitySearchBtnLabel: {
    fontSize: '25px',
    fontWeight: 'bold'
  },
}

class ActivitiesNew extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeCheckboxes: [],
      selectedActivities: [],
      isLoadingActivities: false,
      isLoadingCauses: true,
      fixedHeader: true,
      fixedFooter: true,
      stripedRows: false,
      showRowHover: false,
      selectable: false,
      multiSelectable: false,
      enableSelectAll: false,
      deselectOnClickaway: false,
      showCheckboxes: false,
      bodyStyle: styles,
      checkboxSectionTitle: 'Select Causes to Take Action On',
      searchForActivities: 'Find Actions to Take',
    }

    this.handleCheck = this.handleCheck.bind(this);
    this.searchForActivities = this.searchForActivities.bind(this);
  }

  componentWillMount() {
    this.props.fetchCauses()
    .then(() => {
      this.setState({ isLoadingCauses: false })
    });
  }

  fetchActivitiesFromCauses(selectedCauses) {
    let tempActivitiesArr = [];
    let selectedActivities = [];

    this.setState({isLoadingActivities: true});
    this.props.fetchActivities()
    .then((ActivitiesData) => {
      _.each(selectedCauses, (cause) => {
        return _.filter(ActivitiesData.payload.data, (ActivityObj) => {
          // return activities where cause exists
          if (_.indexOf(ActivityObj.causes, cause) !== -1) {
            tempActivitiesArr.push(ActivityObj);
            // dedupe activities in list
            selectedActivities = _.uniqBy(tempActivitiesArr, 'id');
          }
        });
      });
      this.setState({selectedActivities, isLoadingActivities: false});
    });
  }

  handleCheck(id) {
    let found = this.state.activeCheckboxes.includes(id)
    if (found) {
      this.setState({
        activeCheckboxes: this.state.activeCheckboxes.filter(x => x !== id)
      });
    } else {
      this.setState({
        activeCheckboxes: [ ...this.state.activeCheckboxes, id ]
      });
    }
  }

  searchForActivities() {
    this.fetchActivitiesFromCauses(this.state.activeCheckboxes);
  }

  renderCauseCheckboxes() {
    return this.props.causes.map((cause) => {
      return (
        <GridTile key={cause.id}>
          <Checkbox
            label={cause.name}
            onCheck={() => this.handleCheck(cause.id)}
            checked={this.state.activeCheckboxes.includes(cause.id)}
          />
        </GridTile>
      );
    });
  }

  renderActivities(ActivityArr) {
    if (this.state.isLoadingActivities) {
      return (
        <TableRow>
          <TableRowColumn className="loading-actions">
            <CircularProgress />
          </TableRowColumn>
        </TableRow>
      );
    }

    if (this.state.activeCheckboxes.length > 0 && ActivityArr.length === 0) {
      return (
        <TableRow>
          <TableRowColumn className="loading-actions">
            NOTHING
          </TableRowColumn>
        </TableRow>
      )
    }


    return ActivityArr.map((activity) => {
      return (
        <IndividualActivity ActivityData={activity} key={activity.id} />
      )
    });
  }

  render () {
    if (this.state.isLoadingCauses) {
      return (
        <div className="loading-causes">
          <CircularProgress />
        </div>
      );
    }

    return (
      <div>
        <Card style={this.state.bodyStyle.checkBoxSection}>
          <CardTitle title={this.state.checkboxSectionTitle} />
          <CardText className="checkbox-content">
            <GridList cols={3} cellHeight="auto">
              {this.renderCauseCheckboxes()}
            </GridList>
          </CardText>
        </Card>

        <RaisedButton
          disabled={this.state.activeCheckboxes.length < 1}
          label={this.state.searchForActivities}
          secondary={true}
          onTouchTap={this.searchForActivities}
          style={this.state.bodyStyle.activitySearchBtn}
          labelStyle={this.state.bodyStyle.activitySearchBtnLabel}

        />

        <Table
          style={this.state.bodyStyle.table}
          height={this.state.height}
          fixedHeader={this.state.fixedHeader}
          fixedFooter={this.state.fixedFooter}
          selectable={this.state.selectable}
          multiSelectable={this.state.multiSelectable}
        >
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
          >
            {this.renderActivities(this.state.selectedActivities)}
          </TableBody>
        </Table>

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    causes: state.causes.all
  }
}
// a shortcut to avoid mapDispatchToProps()
export default connect(mapStateToProps, { fetchCauses, fetchActivities, fetchActivity })(ActivitiesNew);
