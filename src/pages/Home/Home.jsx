import React, { Component } from 'react';
import LandingIntroBanner from './components/LandingIntroBanner';

export default class Home extends Component {
  static displayName = 'Home';

  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    // console.log(this.props);
  }
  render() {
    return (
      <div className="home-page">
        <LandingIntroBanner />
      </div>
    );
  }
}
