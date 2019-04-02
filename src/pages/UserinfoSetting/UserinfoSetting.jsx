import React, { Component } from 'react';
import CreateCustomTitleForm from './components/CreateCustomTitleForm';

export default class UserinfoSetting extends Component {
  static displayName = 'UserinfoSetting';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateCustomTitleForm history={this.props} />
      </div>
    );
  }
}
