import React, { Component } from 'react';
import CreateStagetwoForm from './components/CreateStagetwoForm';

export default class Stagetwo extends Component {
  static displayName = 'Stagetwo';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateStagetwoForm history={this.props} />
      </div>
    );
  }
}
