import React, { Component } from 'react';
import CreateVideoUrlForm from './CreateVideoUrlForm/CreateVideoUrlForm';

export default class VideoUrl extends Component {
  static displayName = 'VideoUrl';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateVideoUrlForm history={this.props} />
      </div>
    );
  }
}
