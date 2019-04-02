import React, { Component } from 'react';
import CreateXiaoceshiForm from './CreateXiaoceshiForm/CreateXiaoceshiForm';

export default class Xiaoceshi extends Component {
  static displayName = 'Xiaoceshi';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateXiaoceshiForm history={this.props} />
      </div>
    );
  }
}
