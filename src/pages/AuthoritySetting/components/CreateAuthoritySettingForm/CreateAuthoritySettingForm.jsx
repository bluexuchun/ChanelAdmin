import React, {Component} from 'react';
import axios from 'axios';
import {ajaxTo} from '../../../../util/util';
import IceContainer from '@icedesign/container';
import { Feedback } from '@icedesign/base';
import Img from '@icedesign/img';
import {FormBinderWrapper as IceFormBinderWrapper, FormBinder as IceFormBinder, FormError as IceFormError} from '@icedesign/form-binder';
import {
  Input,
  Button,
  Checkbox,
  Select,
  DatePicker,
  Switch,
  Radio,
  Grid,
  Upload,
  Tab
} from '@icedesign/base';
import { asideNavs } from '../../../../navs'

// const { Group: CheckboxGroup } = Checkbox;
const {Row, Col} = Grid;
const {Core} = Upload;
const {DragUpload}=Upload;
const TabPane = Tab.TabPane;

const tabs = [
  { tab: "权限列表", key: 0, content: "/authoritysettinglist"},
  { tab: "添加权限", key: 1, content: "/authoritysetting/create"},
];

// FormBinder 用于获取表单组件的数据，通过标准受控 API value 和 onChange 来双向操作数据
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const {RangePicker} = DatePicker;

// Switch 组件的选中等 props 是 checked 不符合表单规范的 value 在此做转换
const SwitchForForm = (props) => {
  const checked = props.checked === undefined
    ? props.value
    : props.checked;

  return (<Switch {...props} checked={checked} onChange={(currentChecked) => {
      if (props.onChange)
        props.onChange(currentChecked);
      }}/>);
};

export default class CreateAuthoritySettingForm extends Component {
  static displayName = 'CreateAuthoritySettingForm';

  static defaultProps = {};

  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      logoImg:'',
      value: {
        isapp:false,
        appstatus: false,
        appid:'',
        apprecommend:false,
        appbibei:false,
      },
      getAllClass:"",
    };
  }

  componentWillMount(){
    console.log(asideNavs);
    this.setState({
      allnav:asideNavs
    })
  }

  componentDidMount(){
    const activityId = this.props.history.params.id;
    // 正确获取到activityId的值，去获取他的值
    if(activityId != 'create'){
      ajaxTo('api.php?entry=sys&c=member&a=edit',{'id':activityId})
      .then((res)=>{
        console.log(res)
        console.log(res.authority);
        var  newArr11=[];
        for (var i in res.authority) {
          console.log(i);
          newArr11.push(res.authority[i]+'');
        }
        console.log(newArr11);
        const currentData=res;
        console.log(currentData);
        // 返回的信息
        this.setState({
          value:{
            password:'********',
            confirm_password:'********',
            name:currentData.name,
            remark:currentData.remark,
            // appicon:currentData.appicon,
            // appclass:currentData.appclass,
            status:currentData.status=='1'?true:false,
            appid:currentData.appid,
            authority:newArr11
            // apprecommend:currentData.isRecommend=='1'?true:false,
            // appbibei:currentData.appbibei == '1' ? true : false,
            // appdetail:currentData.appdetail,
            // isapp:currentData.isapp == '1' ? true : false
          },
        })
      })
    }else{
      const allClass = this.state;
      console.log(allClass);
      // this.setState({
      //   value:{
      //     appclass:this.state.getAllClass,
      //   }
      // })
    }
  }


  onChange3(selectedItems) {
    console.log(selectedItems);
  this.setState({
    authority: selectedItems
  });
}
  onFormChange = (value) => {
    this.setState({value});
  };

  onDragOver= () =>{
    console.log("dragover callback");
  }

  onDrop= (fileList) => {
    console.log("drop callback : ", fileList);
  }
  onFileChange=(file)=>{
    // console.log(file.file.imgURL);
    const iconImg = 'https://app.yongketong.cn/'+file.file.imgURL;
    console.log(iconImg);
    // this.setState({
    //   iconImg
    // })
  }

  reset = () => {
    this.setState({
      value: {
        appname:'',
        isapp:false,
        appstatus: false,
        appid:'',
        apprecommend:false,
        apphumen:'',
        appdetail:'',
        appbibei:false
      },
      logoImg:''
    });
  };

  submit = () => {
    const that = this;
    that.formRef.validateAll((error, value) => {
      // console.log('error', error, 'value', value);
      if (error) {
        // 处理表单报错
      }
      // 提交当前填写的数据
      //
      console.log(that.props);

      //
      const dataAry = {...that.formRef.props.value,id:this.props.history.params.id}
      console.log(that.formRef.props.value);

      //修改区
      const newrequestUrl=this.props.history.params.id=='create'?'api.php?entry=sys&c=member&a=edit&do=add':'api.php?entry=sys&c=member&a=edit&do=update';
      console.log(newrequestUrl);
      const result =ajaxTo(newrequestUrl, dataAry);
      console.log(dataAry);
      result.then(function(res) {
        //这是成功请求返回的数据
        // console.log(unescape(res.message));
        Feedback.toast.success(unescape(res.message));
        setTimeout(function(){
          that.props.history.router.push('/authoritysettinglist');
        },1000);

        console.log(res)
      }, function(value) {
        //这是错误请求返回的信息
      })

      // console.log(this.formRef.props.value.name)
    });
  };

  tabClick = (key) => {
    const url = tabs[key].content;
    console.log(url);
    this.props.history.router.push(url);
  }

  render() {
    const defultClass=this.state.getAllClass;

    const styleP={
      paddingBottom:'25px'
    }
    if(this.state.getAllClass){
      var allClassL=[];
      const allClass=this.state.getAllClass.map((item,i)=>{
        return allClassL.push({
                    label: item.sorttitle,
                    value: item.id
                  })
      })
    }

    return (<div className="create-activity-form">
      <IceContainer style={styles.container}>
        <IceFormBinderWrapper ref={(formRef) => {
            this.formRef = formRef;
          }} value={this.state.value} onChange={this.onFormChange}>
          <div>
            <Tab onChange={this.tabChange} defaultActiveKey={1}>
              {tabs.map(item => (
                <TabPane key={item.key} tab={item.tab} onClick={this.tabClick}>

                </TabPane>
              ))}
            </Tab>
            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                用户名：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="name">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="name"/>
              </Col>
            </Row>


            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                密码：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="password">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="password"/>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                确认密码：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="confirm_password">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="confirm_password"/>
              </Col>
            </Row>

            <Row style={{'height':'100px'}}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                备注：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="remark">
                  <Input multiple style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                状态：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="status">
                  <SwitchForForm defaultChecked={this.state.value.appstatus}/>
                </IceFormBinder>
              </Col>
            </Row>

            <Row style={{'height':'150px'}}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                权限设置：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="authority">
                <CheckboxGroup value={this.state.value.authority} onChange={this.onChange3.bind(this)}>
                  {/* <Checkbox indeterminate style={{}} id="apple" value="param">
                    参数设置
                  </Checkbox>
                  <Checkbox id="watermelon" value="back">
                    回复规则列表
                    </Checkbox>
                  <Checkbox id="orange" value="roomcreate">
                    房间创建入口
                  </Checkbox>
                  <Checkbox value="livein">
                    直播入口
                  </Checkbox>
                  <Checkbox value="maneymanage">
                  提现管理
                  </Checkbox>
                  <br/>
                  <Checkbox value="maneyll">
                  财务统计
                  </Checkbox>
                  <Checkbox value="paysetting">
                  支付设置
                  </Checkbox>
                  <Checkbox value="managersetting">
                  管理员设置
                  </Checkbox>
                  <Checkbox value="useinfosetting">
                  用户信息设置
                  </Checkbox>
                  <Checkbox value="coursemanage">
                  系列课程管理
                  </Checkbox>
                  <Checkbox value="topic">
                  话题管理
                  </Checkbox>
                  <br/>
                  <Checkbox value="livemanage">
                  直播间管理
                  </Checkbox>
                  <Checkbox value="videoparamsetting">
                  视频参数设置
                  </Checkbox>
                  <Checkbox value="cloudcomsetting">
                  云通讯设置
                  </Checkbox>
                  <Checkbox value="sharesetting">
                  平台分享设置
                  </Checkbox>
                  <Checkbox value="classmanage">
                  分类管理
                  </Checkbox>
                  <Checkbox value="homeslide">
                  首页幻灯片
                  </Checkbox>
                  <br/>
                  <Checkbox value="usermanage">
                  用户管理
                  </Checkbox>
                  <Checkbox value="homenavmanage">
                  首页导航管理
                  </Checkbox>
                  <Checkbox value="bottommenusetting">
                  底部菜单设置
                  </Checkbox> */}

                  <Checkbox value="1">
                  课程管理
                  </Checkbox>

                  {/* {this.state.allnav?this.state.allnav.map((i,item)=>{
                    return (<Checkbox value={i.text}>
                            {i.text}
                          </Checkbox>)
                  }):null} */}
                </CheckboxGroup>
                </IceFormBinder>
              </Col>
            </Row>

            <Row style={styles.btns}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>

              </Col>
              <Col s="12" l="10">
                <Button type="primary" onClick={this.submit}>
                  {this.props.history.params.id != 'create' ? '保存' : '立即创建'}
                </Button>
                <Button style={styles.resetBtn} onClick={this.reset}>
                  重置
                </Button>
              </Col>
            </Row>
          </div>
        </IceFormBinderWrapper>
      </IceContainer>
    </div>);
  }
}

const styles = {
  checkboxStyle:{
    // margin:'0 16px 16px 0'
    marginLeft:'16px',

  },
  container: {
    paddingBottom: 0
  },
  formItem: {
    height: '28px',
    lineHeight: '28px',
    marginBottom: '25px'
  },
  formLabel: {
    textAlign: 'right'
  },
  btns: {
    margin: '25px 0'
  },
  resetBtn: {
    marginLeft: '20px'
  }
};
