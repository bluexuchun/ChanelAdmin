import React, {Component} from 'react';
import axios from 'axios';
import {ajaxTo, uploadUrl} from '../../../../util/util';
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
    tab: "体验产品列表",
    key: 0,
    content: "/columnclass/0/"
  }, {
    tab: "添加体验产品",
    key: 1,
    content: "/columnclass/0/"
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

export default class CreateTiyanchanpingForm extends Component {
  static displayName = 'CreateTiyanchanpingForm';

  static defaultProps = {};

  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      logoImg: '',
      value: {
      },
      getAllClass: "",
      visible: false,
      chatAll: "",
      title: '123'
    };
  }

  // componentWillMount() {
  //   console.log(uploadUrl);
  //   console.log(this.props);
  //   const that = this;
  //   ajaxTo('api.php?entry=sys&c=webmaster&a=webmaster&do=getTopic').then(function(res) {
  //     console.log(res);
  //     that.setState({getAllClass: res.data})
  //   })
  // }

  componentDidMount(){
    const activityId = this.props.history.params.sid;
    console.log()
      // 正确获取到activityId的值，去获取他的值
    if(activityId != 'create'){
      ajaxTo('api.php?entry=sys&c=applicable&a=applicable&do=edit',{'id':activityId})
      .then((res)=>{
        console.log(res)
        const currentData=res.data;
        console.log(currentData);
          // 返回的信息
        this.setState({
          value:{
            describe:currentData.describe,
            describes:currentData.describes,
            title:currentData.title,
            status:currentData.status=='1'?true:false,
            // name:currentData.appname,
            // apphumen:currentData.apphumen,
            // appicon:currentData.appicon,
            // appclass:currentData.appclass,
            // appstatus:currentData.appstatus=='1'?true:false,
            // appid:currentData.appid,
            // apprecommend:currentData.isRecommend=='1'?true:false,
            // appbibei:currentData.appbibei == '1' ? true : false,
            // appdetail:currentData.appdetail,
            // isapp:currentData.isapp == '1' ? true : false
          },
          logoImg:currentData.banner
        })
      })
    }else{
      const allClass = this.state;
      console.log(allClass);
       this.setState({
         value:{
           appclass:this.state.getAllClass,
         }
       })
    }
  }

  onOpen = () => {
    this.setState({visible: true});
  };

  onClose1 = () => {
    this.setState({visible: false});
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

  changeCourse = (option, value) => {
    const that = this;
    console.log(option, value);

    ajaxTo('api.php?entry=sys&c=webmaster&a=webmaster&do=getChapter', {tid: option}).then(function(res) {
      console.log(res.data)
      var currentChatAll = [];
      if (res.data) {
        res.data.map((i, item) => {
          currentChatAll.push({label: i.title, value: i.id})
        })
      }
      console.log(currentChatAll);

      that.setState({chatAll: currentChatAll, tid: option});
      console.log(that.state.chatAll);
    });
  }
  changeChat = (option, value) => {
    this.setState({cid: option})
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
    this.setState({title: '234'});
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
        sid: this.props.history.params.id,
        id:this.props.history.params.sid,
        banner:this.state.logoImg
      }
      console.log(that.formRef.props.value);

      //修改区
      const newrequestUrl = this.props.history.params.sid == 'create'
        ? 'api.php?entry=sys&c=applicable&a=applicable&do=update'
        : 'api.php?entry=sys&c=applicable&a=applicable&do=update';
      console.log(newrequestUrl);
      const result = ajaxTo(newrequestUrl, dataAry);
      console.log(dataAry);
      result.then(function(res) {
        //这是成功请求返回的数据
        Feedback.toast.success(res.message);
        setTimeout(function() {
          that.props.history.router.push('/columnclass/0/'+that.props.history.params.id);
        }, 1000);

        console.log(res)
      }, function(value) {
        //这是错误请求返回的信息
      })

      // console.log(this.formRef.props.value.name)
    });
  };

  tabClick = (key) => {
    console.log(key);
    if (key == 0) {
      const sid = this.props.history.params.id;
      const url = tabs[key].content;
      console.log(url);
      this.props.history.router.push(url + sid);
    } else {
      const sid = this.props.newData.history.params.id;
      const url = tabs[key].content;
      console.log(url);
      this.props.newData.history.router.push(url + sid + "/create");
    }

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
                步骤标题：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="title" required={true} message="标题名称必须填写">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="title"/>
              </Col>
            </Row>

            <Row style={styleP}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                banner：
              </Col>
              <Col s="12" l="10">
                <Upload style={{
                    display: "block",
                    textAlign: "center",
                    width: "120px",
                    height: "120px",
                    border: "none",
                    borderRadius: "5px",
                    fontSize: "12px"
                  }} action={uploadUrl} accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp" name="filename" beforeUpload={this.beforeUpload} onSuccess={this.onSuccess} onError={this.onError}>
                  {
                    this.state.logoImg
                      ? <Img width={120} height={120} src={this.state.logoImg} type="cover" style={{
                            borderRadius: "5px"
                          }}/>
                      : <div style={{
                            width: "120px",
                            height: "120px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            cursor: "pointer",
                            border: "1px dashed #aaa",
                            borderRadius: "5px"
                          }}>
                          <div style={{
                              color: "#3080FE",
                              fontSize: "30px",
                              width: "100%",
                              textAlign: "center"
                            }}>+</div>
                          <div style={{
                              color: "#3080FE",
                              fontSize: "14px",
                              width: "100%",
                              textAlign: "center"
                            }}>上传图片</div>
                        </div>
                  }
                </Upload>
              </Col>
            </Row>

            <Row style={styles.formItem1}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                步骤描述1：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="describe" required={true} message="标题名称必须填写">
                  <Input multiple style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="describe"/>
              </Col>
            </Row>

            <Row style={styles.formItem1}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                步骤描述2：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="describes" required={true} message="标题名称必须填写">
                  <Input multiple style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="describes"/>
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
                    this.props.history.params.sid != 'create'
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
