import React, { Component } from 'react';
import CreateManagerSettingForm from './components/CreateManagerSettingForm';

export default class ManagerSetting extends Component {
  static displayName = 'ManagerSetting';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateManagerSettingForm history={this.props} />
      </div>
    );
  }
}
