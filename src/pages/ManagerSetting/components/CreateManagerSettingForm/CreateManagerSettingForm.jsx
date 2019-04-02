import React, {Component} from 'react';
import axios from 'axios';
import {ajaxTo} from '../../../../util/util';
import IceContainer from '@icedesign/container';
import {Feedback} from '@icedesign/base';
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
  Tab,
  Dialog
} from '@icedesign/base';


const {Row, Col} = Grid;
const {Core} = Upload;
const {DragUpload} = Upload;
const TabPane = Tab.TabPane;

const tabs = [
  {
    tab: "管理员列表",
    key: 0,
    content: "/managersettinglist"
  }, {
    tab: "添加管理员",
    key: 1,
    content: "/managersetting/create"
  }
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

export default class CreateManagerSettingForm extends Component {
  static displayName = 'CreateManagerSettingForm';

  static defaultProps = {};

  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      logoImg: '',
      value: {
        isapp: false,
        appstatus: false,
        appid: '',
        apprecommend: false,
        appbibei: false
      },
      getAllClass: "",
      visible: false,
      chatAll:"",
      title:'123'
    };
  }

  componentWillMount(){
    const that = this;
    ajaxTo('api.php?entry=sys&c=webmaster&a=webmaster&do=getTopic')
    .then(function(res){
      console.log(res);
      that.setState({
        getAllClass:res.data,
      })
    })
  }

  // componentDidMount(){
  //   const activityId = this.props.history.params.id;
  //    // 正确获取到activityId的值，去获取他的值
  //   if(activityId != 'create'){
  //     ajaxTo('api.php?entry=sys&c=webmaster&a=webmaster&do=edit',{'id':activityId})
  //     .then((res)=>{
  //       console.log(res)
  //       const currentData=res.data;
  //       console.log(currentData);
  //        // 返回的信息
  //       this.setState({
  //         value:{
  //           name:currentData.appname,
  //           apphumen:currentData.apphumen,
  //           appicon:currentData.appicon,
  //           appclass:currentData.appclass,
  //           appstatus:currentData.appstatus=='1'?true:false,
  //           appid:currentData.appid,
  //           apprecommend:currentData.isRecommend=='1'?true:false,
  //           appbibei:currentData.appbibei == '1' ? true : false,
  //           appdetail:currentData.appdetail,
  //           isapp:currentData.isapp == '1' ? true : false
  //         },
  //         logoImg:currentData.appicon
  //       })
  //     })
  //   }else{
  //     const allClass = this.state;
  //     console.log(allClass);
  //      this.setState({
  //        value:{
  //          appclass:this.state.getAllClass,
  //        }
  //      })
  //   }
  // }

  onOpen = () => {
  this.setState({
    visible: true
  });
};

onClose1 = () => {
  this.setState({
    visible: false
  });
};


  onError = (file) => {
    console.log('onError callback : ', file);
  }
  beforeUpload = (info) => {
    console.log('beforeUpload callback : ', info);
  }

  onSuccess = (res, file) => {
    console.log(res)
    Feedback.toast.success('上传成功');
    const logoImg = 'http://' + res.imgURL;
    this.setState({logoImg: logoImg})
  }

  onFormChange = (value) => {
    this.setState({value});
  };

  onDragOver = () => {
    console.log("dragover callback");
  }

  onDrop = (fileList) => {
    console.log("drop callback : ", fileList);
  }
  onFileChange = (file) => {
    // console.log(file.file.imgURL);
    const iconImg = 'https://app.yongketong.cn/' + file.file.imgURL;
    console.log(iconImg);
    // this.setState({
    //   iconImg
    // })
  }
//搜索完毕
  onClose=(value)=>{
    this.setState({
      visible:false
    })
    const that=this;
    ajaxTo('api.php?entry=sys&c=webmaster&a=webmaster&do=getuserInfo',{keyword:that.state.searchValue})
    .then(function(res){
      Feedback.toast.success(res.message);
      console.log(res);
      that.setState({
        uid:res.user.id,
        value:{
          username:res.user.nickname
        }
      })
    })
  }
  srarchChange=(value)=>{
    console.log(value);
    this.setState({
      searchValue:value
    })
  }

  changeCourse = (option,value) =>{
    const that=this;
    console.log(option,value);


    ajaxTo('api.php?entry=sys&c=webmaster&a=webmaster&do=getChapter',{tid:option})
    .then(function(res){
      console.log(res.data)
      var  currentChatAll=[];
      if(res.data){
        res.data.map((i,item)=>{
          currentChatAll.push({label: i.title, value: i.id})
        })
      }
      console.log(currentChatAll);

      that.setState({
        chatAll:currentChatAll,
        tid:option
      });
      console.log(that.state.chatAll);
    });
  }
  changeChat=(option,value)=>{
    this.setState({
      cid:option
    })
  }
  reset = () => {
    // this.setState({
    //   value: {
    //     appname: '',
    //     isapp: false,
    //     appstatus: false,
    //     appid: '',
    //     apprecommend: false,
    //     apphumen: '',
    //     appdetail: '',
    //     appbibei: false
    //   },
    //   logoImg: ''
    // });
    this.setState({
      title:'234'
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
      const dataAry = {
        ...that.formRef.props.value,
        id: this.props.history.params.id,
        cid:this.state.cid,
        tid:this.state.tid,
        uid:this.state.uid
      }
      console.log(that.formRef.props.value);

      //修改区
      const newrequestUrl = this.props.history.params.activityId == 'create'
        ? 'api.php?entry=sys&c=webmaster&a=webmaster&do=updates'
        : 'api.php?entry=sys&c=webmaster&a=webmaster&do=updates';
      console.log(newrequestUrl);
      const result = ajaxTo(newrequestUrl, dataAry);
      console.log(dataAry);
      result.then(function(res) {
        //这是成功请求返回的数据
        Feedback.toast.success(res.message);
        setTimeout(function() {
          that.props.history.router.push('/managersettinglist');
        }, 1000);

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

    const defultClass = this.state.getAllClass;

    const styleP = {
      paddingBottom: '25px'
    }
    if (this.state.getAllClass) {
      // console.log(this.state.getAllClass)
      var allClassL = [];
      const allClass = this.state.getAllClass.map((item, i) => {
        // console.log(item,i);
        return allClassL.push({label: item.topic_name, value: item.id})
      })
    }





    return (<div className="create-activity-form">
      <IceContainer style={styles.container}>
        <IceFormBinderWrapper ref={(formRef) => {
            this.formRef = formRef;
          }} value={this.state.value} onChange={this.onFormChange}>
          <div>
            <Tab onChange={this.tabChange} defaultActiveKey={1}>
              {tabs.map(item => (<TabPane key={item.key} tab={item.tab} onClick={this.tabClick}></TabPane>))}
            </Tab>
            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                选择用户：
              </Col>

              <Col s="12" l="10">
                <span>
                  <Button onClick={this.onOpen} type="primary">
                    选择用户
                  </Button>
                  <Dialog visible={this.state.visible} onOk={this.onClose} closable="esc,mask,close" onCancel={this.onClose1} onClose={this.onClose1} title="搜索用户">
                    <Input onChange={this.srarchChange.bind(this)} style={{
                        width: '100%'
                      }}/>
                  </Dialog>
                </span>
              </Col>
            </Row>


            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                用户名称：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="username" required={true} message="标题名称必须填写">
                  <Input
                     disabled={true}
                     style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="username"/>
              </Col>
            </Row>



            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                选择课程：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="appclass">
                  <Select className="next-form-text-align" dataSource={allClassL} onChange={this.changeCourse}/>
                </IceFormBinder>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                选择章节：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="class1">
                  <Select className="next-form-text-align" dataSource={this.state.chatAll} onChange={this.changeChat} />
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



            <Row style={styles.btns}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}></Col>
              <Col s="12" l="10">
                <Button type="primary" onClick={this.submit}>
                  {
                    this.props.history.params.id != 'create'
                      ? '保存'
                      : '立即创建'
                  }
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
