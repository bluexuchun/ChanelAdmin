import React, { Component } from 'react';
import CreateRegisterManage from './components/CreateRegisterManage';

export default class RegisterManage extends Component {
  static displayName = 'RegisterManage';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateRegisterManage history={this.props} />
      </div>
    );
  }
}
