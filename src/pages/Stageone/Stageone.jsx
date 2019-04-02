import React, { Component } from 'react';
import CreateStageoneForm from './components/CreateStageoneForm';

export default class Stageone extends Component {
  static displayName = 'Stageone';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateStageoneForm history={this.props} />
      </div>
    );
  }
}
