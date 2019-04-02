import React, { PureComponent } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { display,edit } from '../store/setting.redux';
import {ajaxTo} from '../util/util';

@connect(
  state=>({setting:state.settingDate}),
  {display,edit}
)

export default class Logo extends PureComponent {
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
          righttext:res.data.righttext
        })
      }

    })

  }
  render() {
    return (
      <div className="logo" style={{}}>
        <Link to="/" className="logo-text">
          {this.state.righttext?this.state.righttext:''}
        </Link>
      </div>
    );
  }
}
