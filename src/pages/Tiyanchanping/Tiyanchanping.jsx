import React, { Component } from 'react';
import CreateTiyanchanpingForm from './components/CreateTiyanchanpingForm';

export default class Tiyanchanping extends Component {
  static displayName = 'Tiyanchanping';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateTiyanchanpingForm history={this.props} />
      </div>
    );
  }
}
