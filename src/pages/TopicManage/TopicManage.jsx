import React, { Component } from 'react';
import CreateTopicManageForm from './components/CreateTopicManageForm';

export default class TopicManage extends Component {
  static displayName = 'TopicManage';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateTopicManageForm history={this.props} />
      </div>
    );
  }
}
