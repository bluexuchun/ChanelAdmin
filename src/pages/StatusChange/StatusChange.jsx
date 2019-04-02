import React, { Component } from 'react';
import CreateStatusChangeForm from './components/CreateStatusChangeForm';

export default class StatusChange extends Component {
  static displayName = 'StatusChange';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateStatusChangeForm history={this.props} />
      </div>
    );
  }
}
