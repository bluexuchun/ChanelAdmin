import React, { Component } from 'react';
import CreateEditUserSettingForm from './components/CreateEditUserSettingForm';

export default class EditUserSetting extends Component {
  static displayName = 'EditUserSetting';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateEditUserSettingForm history={this.props} />
      </div>
    );
  }
}
