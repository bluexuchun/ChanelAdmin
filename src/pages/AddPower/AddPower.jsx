import React, { Component } from 'react';
import CreateAddPower from './components/CreateAddPower';

export default class AddPower extends Component {
  static displayName = 'AddPower';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateAddPower history={this.props} />
      </div>
    );
  }
}
