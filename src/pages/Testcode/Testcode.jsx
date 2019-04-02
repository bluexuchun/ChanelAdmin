import React, { Component } from 'react';
import CreateTestcode from './components/CreateTestcode';

export default class Testcode extends Component {
  static displayName = 'Testcode';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateTestcode history={this.props} />
      </div>
    );
  }
}
