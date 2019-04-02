import React, { Component } from 'react';
import CreateTranscationForm from './components/CreateTranscationForm';

export default class Transcation extends Component {
  static displayName = 'Transcation';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateTranscationForm history={this.props} />
      </div>
    );
  }
}
