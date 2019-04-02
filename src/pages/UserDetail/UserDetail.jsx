import React, { Component } from 'react';
import CreateUserDetailForm from './components/CreateUserDetailForm';

export default class UserDetail extends Component {
  static displayName = 'UserDetail';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateUserDetailForm history={this.props} />
      </div>
    );
  }
}
