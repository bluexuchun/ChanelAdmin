import React, { Component } from 'react';
import { Button } from '@icedesign/base';
import { connect } from 'react-redux';
import { display,edit } from '../../../../store/setting.redux';
import { Link } from 'react-router';
import {ajaxTo} from '../../../../util/util';
import './LandingIntroBanner.scss';

// 寻找背景图片可以从 https://unsplash.com/ 寻找
const backgroundImage =
  'https://img.alicdn.com/tfs/TB1j9kWgvDH8KJjy1XcXXcpdXXa-1680-870.jpg';

  @connect(
    state=>({setting:state.settingDate}),
    {display,edit}
  )

export default class LandingIntroBanner extends Component {
  static displayName = 'LandingIntroBanner';

  constructor(props) {
    super(props);
    this.state = {
      righttext:''
    };
  }
  componentWillMount(){
    const that=this;
    this.props.display();
    console.log(this.props);
    ajaxTo('api.php?entry=sys&c=setting&a=setting&do=display')
    .then(function(res){

      if(res.data){
        console.log(res);
        that.setState({
          righttext:res.data.xiangmuname
        })
      }

    })

  }

  render() {
    // 登录介绍页面默认撑满一屏高度
    return (
      <div className="landing-intro-banner-wrapper">
        <div style={styles.landingIntro}>
          <div
            style={{
              ...styles.landingIntroBackground,
              backgroundImage: `url(${backgroundImage})`,
            }}
          />
          <div
            className="landing-intro-banner-content-wrapper"
            style={styles.contentWrapper}
          >
            <div>
              <h2 style={styles.title}>
                更快，更优，更 Cool !<br />欢迎使用 {this.state.righttext} 管理系统
              </h2>
              <div style={styles.buttons}>
                <Link to="/link-to-help-document">
                  <Button
                    style={{
                      margin: '0 10px 20px',
                      height: 50,
                      padding: '0 58px',
                      fontSize: 16,
                      color: '#fff',
                    }}
                    type="primary"
                    size="large"
                    shape="ghost"
                  >
                    查看帮助
                  </Button>
                </Link>
                <Link to="/link-to-dashboard">
                  <Button
                    style={{
                      margin: '0 10px 20px',
                      height: 50,
                      padding: '0 58px',
                      fontSize: 16,
                    }}
                    type="primary"
                    size="large"
                  >
                    立即使用
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  landingIntro: {
    position: 'relative',
    height: '100vh',
  },
  landingIntroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundSize: 'cover',
  },
  contentWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    color: '#fff',
    letterSpacing: '1.94px',
    lineHeight: '48px',
  },
  buttons: { textAlign: 'center', marginTop: 70 },
};
