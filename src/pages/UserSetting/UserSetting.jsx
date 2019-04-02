import React, { Component } from 'react';
import UserSettingForm from './UserSettingForm/UserSettingForm';

export default class UserSetting extends Component {
  static displayName = 'UserSetting';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <UserSettingForm history={this.props} />
      </div>
    );
  }
}
