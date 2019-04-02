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
  NumberPicker,
  TimePicker
} from '@icedesign/base';

const {Row, Col} = Grid;
const {Core, DragUpload} = Upload;
// const {DragUpload}=Upload;
const TabPane = Tab.TabPane;

const tabs = [
  {
    tab: "管理员列表",
    key: 0,
    content: "administratorslist"
  },
  // {
  //   tab: "管理员详情",
  //   key: 1,
  //   content: "/administrators/create"
  // }
];

// FormBinder 用于获取表单组件的数据，通过标准受控 API value 和 onChange 来双向操作数据
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const {MonthPicker, YearPicker, RangePicker} = DatePicker;
// const { DragUpload } = Upload;

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

export default class CreateAdministratorsForm extends Component {
  static displayName = 'CreateAdministratorsForm';

  static defaultProps = {};

  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      logoImg: '',
      // value: {
      //   isapp: false,
      //   appstatus: false,
      //   appid: '',
      //   apprecommend: false,
      //   appbibei: false,
      //   authority: []
      // },
      editable: false,
      value: 0,
      homestyle: 'list',
      seleectArr: [
        {
          label: '图片',
          value: '1'
        }, {
          label: '视频/音频',
          value: '2'
        }
      ],

       num:""
    };
  }

  // componentWillMount() {
  //   const that = this;
  //   ajaxTo('api.php?entry=sys&c=course&a=course&do=getTags').then(function(res) {
  //     console.log(res);
  //     let testAry = [];
  //     for (let i = 0; i < res.data.length; i++) {
  //       testAry.push(res.data[i]);
  //     }
  //     that.setState({getAllClass: testAry})
  //   });
  // }

  componentDidMount() {
    const activityId = this.props.history.params.id;
    console.log(activityId);
     // 正确获取到activityId的值，去获取他的值
    if (activityId != 'create') {
      ajaxTo('https://lem.chanel.com.cn/api.php?entry=sys&c=adminList&a=admin&do=edit', {'id': activityId}).then((res) => {
        //console.log(res)
        const currentData = res.data;
        //console.log(currentData);

         // 返回的信息
        if(res.data){
          this.setState({
            value: {
              name:currentData.name,
              password: currentData.password,
              email: currentData.email,
              phone:currentData.phone,
              status: currentData.status == '1'
                ? true
                : false,

            },
          })
        }
      })
    } else {
      const allClass = this.state;
      console.log(allClass);
       this.setState({
         value:{
           appclass:this.state.getAllClass,
         }
       })
    }
  }

  // onError = (file) => {
  //   console.log('onError callback : ', file);
  // }
  // beforeUpload = (info) => {
  //   console.log('beforeUpload callback : ', info);
  // }

  // onSuccess = (res, file) => {
  //   console.log(res)
  //   Feedback.toast.success('上传成功');
  //   const logoImg = 'http://' + res.imgURL;
  //   this.setState({logoImg: logoImg})
  // }
  // onError1 = (file) => {
  //   console.log('onError callback : ', file);
  // }
  // beforeUpload1 = (info) => {
  //   console.log('beforeUpload callback : ', info);
  // }

  // onSuccess1 = (res, file) => {
  //   console.log(res)
  //   Feedback.toast.success('上传成功');
  //   const logoImg = 'http://' + res.imgURL;
  //   this.setState({logoImg1: logoImg})
  // }
  // onFormChange1 = (value) => {
  //    this.setState({value});
  // };

  onDragOver = () => {
    console.log("dragover callback");
  }

  onDrop = (fileList) => {
    console.log("drop callback : ", fileList);
  }
  // onFileChange = (file) => {
  //    console.log(file.file.imgURL);
  //   const iconImg = 'https://lem.chanel.com.cn/' + file.file.imgURL;
  //   console.log(iconImg);
  //    this.setState({
  //      iconImg
  //    })
  // }
  onChange(value) {
    console.log("changed", value);
    this.setState({num: value});
  }
  onChange2(value) {
    this.setState({homestyle: value});
  }
  reset = () => {
    this.setState({
      value: {
        appname: '',
        isapp: false,
        appstatus: false,
        appid: '',
        apprecommend: false,
        apphumen: '',
        appdetail: '',
        appbibei: false
      },
      logoImg: ''
    });
  };
  onChange3(selectedItems) {
    console.log(selectedItems)
    this.setState({authority: selectedItems});

  }
onChangeSelect(value,option){
  console.log(value,option);
  this.setState({
    topic_type:value
  })
}

checkPasswd = (rule, values, callback) => {
  if (!values) {
    callback('请输入正确的密码');
  } else if (values.length < 8) {
    callback('密码必须大于8位');
  } else if (values.length > 16) {
    callback('密码必须小于16位');
  } else {
    callback();
  }
};
  submit = () => {
    const that = this;
    that.formRef.validateAll((error, value) => {
      console.log(value);
      if (error) {
         // 处理表单报错
      }
       // 提交当前填写的数据

      console.log(that.props);
      console.log(that.formRef.props);

      const dataAry = {
        ...that.formRef.props.value,
        id: this.props.history.params.id,
      }
      console.log(that.formRef.props.value);

      // 修改区
      const newrequestUrl = this.props.history.params.id == 'create'
        ? 'https://lem.chanel.com.cn/api.php?entry=sys&c=adminList&a=admin&do=update'
        : 'https://lem.chanel.com.cn/api.php?entry=sys&c=adminList&a=admin&do=update';
      console.log(newrequestUrl);
      const result = ajaxTo(newrequestUrl, dataAry);
      console.log(dataAry);
      result.then(function(res) {
        // 这是成功请求返回的数据
        Feedback.toast.success(res.message);
        setTimeout(function() {
          that.props.history.router.push('/administratorslist');
        }, 1000);

        console.log(res)
      }, function(value) {
        // 这是错误请求返回的信息
      })

       console.log(this.formRef.props.value.name)
    });
  };

  tabClick = (key) => {
    const url = tabs[key].content;
    console.log(url);
    this.props.history.router.push(url);
  }

  render() {
    // const defultClass = this.state.getAllClass;
    //  var params='';
    //  if(defultClass){
    //    defultClass.map((i,value)=>{
    //       console.log(i,value);
    //       params=<Checkbox indeterminate style={{}} id={value} value={value}>
    //        {i.tag_name}
    //      </Checkbox>
    //    })
    //  }

    const styleP = {
      paddingBottom: '25px'
    }

    // const tagsList = [];
    // const tagslists = this.state.value.authority;
    //  // console.log(tagslists.length);
    // if (tagslists) {
    //   for (var i in tagslists) {
    //     tagsList.push(tagslists[i]);
    //   }
    // }
    // console.log(tagsList[0]);
    //
    // var allClassL = [];
    //
    //
    // 、、console.log(this.state.starttime, this.state.endtime);
    return (<div className="create-activity-form">
      <IceContainer style={styles.container}>
        <IceFormBinderWrapper ref={(formRef) => {
            this.formRef = formRef;
          }} value={this.state.value} onChange={this.onFormChange}>
          <div>
            {/* <Tab onChange={this.tabChange} defaultActiveKey={1}>
              {tabs.map(item => (<TabPane key={item.key} tab={item.tab} onClick={this.tabClick}></TabPane>))}
            </Tab> */}
            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                账号：
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

            {/* <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                当前密码：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="password">
                  <Input disabled style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="password"/>
              </Col>
            </Row> */}

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                修改后的密码：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder validator={this.checkPasswd}   name="newpassword">
                  <Input placeholder="如果不需要修改密码请勿填写"   style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="newpassword"/>
              </Col>
            </Row>

            {/* <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                手机号：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="phone">
                  <Input  style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="phone"/>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                邮箱：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="email">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="email"/>
              </Col>
            </Row> */}



            {/* <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                显示/隐藏：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="status">
                  <SwitchForForm defaultChecked={this.state.value.status}/>
                </IceFormBinder>
              </Col>
            </Row> */}

            <Row style={styles.btns}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}></Col>
              <Col s="12" l="10">
                <Button type="primary" onClick={this.submit}>
                  {
                    this.props.history.params.id!= 'create'
                      ? '更新'
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
    marginTop: '25px',
    marginBottom: '10px'
  },
  formItem1: {
    height: '145px',
    lineHeight: '28px',
    marginBottom: '25px'
  },
  formLabel: {
    textAlign: 'right'
  },
  btns: {
    margin: '25px 0'
  },
  huise: {
    color: '#CFCFCF'
  },
  resetBtn: {
    marginLeft: '20px'
  }
};
