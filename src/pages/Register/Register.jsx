import React, { Component } from 'react';
import UserRegister from './components/UserRegister';

export default class Register extends Component {
  static displayName = 'Register';

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log(this.props);
  }

  render() {
    return (
      <div className="login-page">
        <UserRegister child={this.props} />
      </div>
    );
  }
}
