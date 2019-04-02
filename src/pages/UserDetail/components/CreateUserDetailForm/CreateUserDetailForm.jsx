import React, {Component} from 'react';
import axios from 'axios';
import {ajaxTo,uploadUrl} from '../../../../util/util';
import IceContainer from '@icedesign/container';
import {Feedback, Field} from '@icedesign/base';
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
  Menu
} from '@icedesign/base';

const {Row, Col} = Grid;

const SwitchForForm = (props) => {
  const checked = props.checked === undefined
    ? props.value
    : props.checked;

  return (<Switch {...props} checked={checked} onChange={(currentChecked) => {
      if (props.onChange)
        props.onChange(currentChecked);
      }}/>);
};

export default class CreateUserDetailForm extends Component {
  field = new Field(this);
  static displayName = 'CreateUserDetailForm';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      logoImg: '',
      value: {},
      getAllClass: ""
    };
  }
  //请求全部的活动分类
  componentWillMount() {

  }
  //编辑的活动数据
  componentDidMount() {
    const activityId = this.props.history.params.id;
    // 正确获取到activityId的值，去获取他的值
    if (activityId != 'create') {
      ajaxTo('api.php?entry=sys&c=user&a=userManagement&do=userEdit', {'id': activityId}).then((res) => {
        console.log(res)
        const currentData = res.data;
        // 返回的信息
        this.setState({
          value: {
            phone:currentData.phone,
            username:currentData.username,
            id:currentData.id,
            Worknumber:currentData.Worknumber,
            counter:currentData.counter,
            batch:currentData.batch,
            date:currentData.date,
            counterCode:currentData.counterCode,
            working:currentData.working,
            position:currentData.position
          },
        })
      })
    } else {
      const allClass = this.state;
      this.setState({
        value: {
          activityclass: this.state.getAllClass
        }
      })
    }
  }

  onChange(checked) {
    var that = this;
    const nameValue = that.props.name;
    this.setState({value: {}})
  }

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
    this.setState({logoImg:logoImg});
  }
  onFormChange = (value) => {
    // this.setState({value});
  };

  onDragOver = () => {
    console.log("dragover callback");
  }

  onDrop = (fileList) => {
    console.log("drop callback : ", fileList);
  }

  onFileChange = (file) => {
    const iconImg = 'https://lem.chanel.com.cn/' + file.file.imgURL;
  }

  reset = () => {
    this.setState({
      value: {
        abstract: '',
        daytitle: '',
        displayorder: '',
        sid: '',
        status: '',

      },
      starttime: "",
      endtime: "",
      logoImg: ''
      // logoImg1: ''
    });
  };
  submit = () => {
    const that = this;
    that.formRef.validateAll((error, value) => {
      if (error) {
        // 处理表单报错
      }
      const dataAry = {
        ...that.formRef.props.value,
        banner: that.state.logoImg,
        icon: that.state.logoImg1,
        id: that.props.history.params.id,
        titles:that.state.logoImg2
      }

      //修改区
      const newrequestUrl = 'api.php?entry=sys&c=user&a=userManagement&do=userUpdate';
      console.log(newrequestUrl);
      const result = ajaxTo(newrequestUrl, dataAry);
      result.then(function(res) {
        //这是成功请求返回的数据
        Feedback.toast.success(res.message);
        setTimeout(function() {
          that.props.history.router.push('/usersetting');
        }, 1000);
        console.log(res)
      }, function(value) {
        //这是错误请求返回的信息
      })
    });
  };

  render() {
    const init = this.field.init;
    const defultClass = this.state.getAllClass;

    const styleP = {
      paddingBottom: '25px'
    }
    if (this.state.getAllClass) {
      var allClassL = [];
      const allClass = this.state.getAllClass.map((item, i) => {
        return allClassL.push({label: item.title, value: item.id})
      })
    }

    return (<div className="create-activity-form">
      <IceContainer title="香奈儿" style={styles.container}>
        <IceFormBinderWrapper ref={(formRef) => {
            this.formRef = formRef;
          }} value={this.state.value} onChange={this.onFormChange}>
          <div>
            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                姓名：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="username" required={true} message="标题名称必须填写">
                  <Input disabled style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="username"/>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                手机号：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="phone" required={true} message="标题名称必须填写">
                  <Input disabled style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="phone"/>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                工号：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="Worknumber" >
                  <Input disabled style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="Worknumber"/>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                工作地点：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="working" required={false}>
                  <Input disabled style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="working"/>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                职位：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="position" required={false}>
                  <Input disabled style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="position"/>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                柜台：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="counter" required={false}>
                  <Input disabled style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="counter"/>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                柜台编号：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="counterCode" required={false}>
                  <Input disabled style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="counterCode"/>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                期数：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="batch" required={true} message="标题名称必须填写">
                  <Input disabled style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="batch"/>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                入职日期：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="date" required={true} message="标题名称必须填写">
                  <Input disabled style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="date"/>
              </Col>
            </Row>

            {/* <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>

              </Col>

              <Col s="12" l="10">
                <Feedback key='prompt' title="" type='prompt' shape='toast'>
                  入职日期请以 "1970-00-00" 格式修改
                </Feedback>
              </Col>
            </Row> */}

            <Row style={styles.btns}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}></Col>
              <Col s="12" l="10">
                <Button type="primary" onClick={this.submit}>
                  {
                    this.props.history.params.activityId != 'create'
                      ? '更新'
                      : '立即创建'
                  }
                </Button>
                {/* <Button style={styles.resetBtn} onClick={this.reset}>
                  重置
                </Button> */}
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
