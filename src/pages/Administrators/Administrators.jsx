import React, { Component } from 'react';
import CreateAdministratorsForm from './components/CreateAdministratorsForm';

export default class Administrators extends Component {
  static displayName = 'Administrators';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateAdministratorsForm history={this.props} />
      </div>
    );
  }
}
