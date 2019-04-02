import React, { Component } from 'react';
import CreateHaveNumForm from './CreateHaveNumForm/CreateHaveNumForm';

export default class HaveNum extends Component {
  static displayName = 'HaveNum';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateHaveNumForm history={this.props} />
      </div>
    );
  }
}
