import React, { Component } from 'react';
import CreateHiddenFileForm from './components/CreateHiddenFileForm';

export default class HiddenFile extends Component {
  static displayName = 'HiddenFile';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateHiddenFileForm history={this.props} />
      </div>
    );
  }
}
