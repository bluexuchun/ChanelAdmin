import React, { Component } from 'react';
import CreateColumn from './components/CreateColumn';

export default class Column extends Component {
  static displayName = 'Column';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="page3-page">
        <CreateColumn history={this.props} />
      </div>
    );
  }
}
