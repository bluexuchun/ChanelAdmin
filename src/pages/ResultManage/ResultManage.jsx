import React, { Component } from 'react';
import CreateResultManageForm from './components/CreateResultManageForm';

export default class ResultManage extends Component {
  static displayName = 'ResultManage';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateResultManageForm history={this.props} />
      </div>
    );
  }
}
