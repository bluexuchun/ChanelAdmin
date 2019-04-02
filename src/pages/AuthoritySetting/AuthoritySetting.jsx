import React, { Component } from 'react';
import CreateAuthoritySettingForm from './components/CreateAuthoritySettingForm';

export default class AuthoritySetting extends Component {
  static displayName = 'AuthoritySetting';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateAuthoritySettingForm history={this.props} />
      </div>
    );
  }
}
