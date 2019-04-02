import React, { Component } from 'react';
import LeaveListForm from './LeaveListForm/LeaveListForm';

export default class LeaveList extends Component {
  static displayName = 'LeaveList';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <LeaveListForm history={this.props} />
      </div>
    );
  }
}
