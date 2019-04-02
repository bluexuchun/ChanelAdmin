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
const {Core} = Upload;
const {DragUpload} = Upload;
// FormBinder 用于获取表单组件的数据，通过标准受控 API value 和 onChange 来双向操作数据
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const {MonthPicker, YearPicker, RangePicker} = DatePicker;

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

export default class CreateActivityForm extends Component {
  field = new Field(this);
  static displayName = 'CreateActivityForm';

  static defaultProps = {};

  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      logoImg: '',
      // logoImg1: '',
      value: {},
      // starttime: "2017-02-14",
      // endtime: "2017-03-24",
      getAllClass: ""
    };
  }
  //请求全部的活动分类
  componentWillMount() {
    const that = this;
    ajaxTo('api.php?entry=sys&c=schedule&a=schedule&do=getStage').then(function(res) {
      console.log(res);
      that.setState({getAllClass: res.data})
    })
  }
  //编辑的活动数据
  componentDidMount() {
    const activityId = this.props.history.params.activityId;
    // 正确获取到activityId的值，去获取他的值
    if (activityId != 'create') {
      ajaxTo('api.php?entry=sys&c=schedule&a=schedule&do=edit', {'id': activityId}).then((res) => {
        console.log(res)
        const currentData = res.data;
        console.log(activityId);
        // 返回的信息
        this.setState({
          value: {
            daytitle: currentData.daytitle,
            id: currentData.id,
            displayorder: currentData.displayorder,
            sid: currentData.sid,
            // activityicon: currentData.banner,
            // activityclass: currentData.activityclass,
            status: currentData.status == '1'
              ? true
              : false,
            abstract: currentData.abstract
          },
          logoImg: currentData.banner,
          logoImg1: currentData.icon,
          logoImg2: currentData.titles
        })
      })
    } else {
      const allClass = this.state;
      console.log(allClass);
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
    console.log(checked)
    console.log(nameValue);
    this.setState({value: {}})
  }

  onError = (file) => {
    console.log('onError callback : ', file);
  }
  onError1 = (file) => {
    console.log('onError callback : ', file);
  }
  onError2 = (file) => {
    console.log('onError callback : ', file);
  }
  beforeUpload = (info) => {
    console.log('beforeUpload callback : ', info);
  }
  beforeUpload1 = (info) => {
    console.log('beforeUpload callback : ', info);
  }
  beforeUpload2 = (info) => {
    console.log('beforeUpload callback : ', info);
  }

  onSuccess = (res, file) => {
    console.log(res)
    Feedback.toast.success('上传成功');
    const logoImg = 'http://' + res.imgURL;
    this.setState({logoImg:logoImg});
  }
  onSuccess1 = (res, file) => {
    console.log(res)
    Feedback.toast.success('上传成功');
    const logoImg1 = 'http://' + res.imgURL;
    this.setState({logoImg1:logoImg1});
  }
  onSuccess2 = (res, file) => {
    console.log(res)
    Feedback.toast.success('上传成功');
    const logoImg2 = 'http://' + res.imgURL;
    this.setState({logoImg2:logoImg2});
  }
  // onSuccess1=(res,file)=>{
  //   console.log(res)
  //   Feedback.toast.success('上传成功');
  //   const logoImg1 = 'http://' + res.imgURL;
  //   this.setState({logoImg1:logoImg1});
  // }
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
    // console.log(file.file.imgURL);
    const iconImg = 'https://lem.chanel.com.cn/' + file.file.imgURL;
    console.log(iconImg);
    // this.setState({
    //   iconImg
    // })
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
      // console.log('error', error, 'value', value);
      if (error) {
        // 处理表单报错
      }
      // 提交当前填写的数据
      //
      console.log(that.props);
      // console.log(this.field.getValues());
      // const starttime = this.field.getValues().rangepicker[0];
      // console.log(starttime);
      // const endtime = this.field.getValues().rangepicker[1];
      //
      const dataAry = {
        ...that.formRef.props.value,
        banner: that.state.logoImg,
        icon: that.state.logoImg1,
        id: that.props.history.params.activityId,
        titles:that.state.logoImg2
        // starttime: starttime,
        // endtime: endtime
      }
      console.log(that.formRef.props.value);
      console.log(dataAry)

      //修改区
      const newrequestUrl = this.props.history.params.activityId == 'create'
        ? 'api.php?entry=sys&c=schedule&a=schedule&do=update'
        : 'api.php?entry=sys&c=schedule&a=schedule&do=update';
      console.log(newrequestUrl);
      const result = ajaxTo(newrequestUrl, dataAry);
      result.then(function(res) {
        //这是成功请求返回的数据
        Feedback.toast.success(res.message);
        setTimeout(function() {
          that.props.history.router.push('/activityList');
        }, 1000);
        console.log(res)
      }, function(value) {
        //这是错误请求返回的信息
      })

      // console.log(this.formRef.props.value.name)
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
                主题名称：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="daytitle" required={true} message="标题名称必须填写">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="daytitle"/>
              </Col>
            </Row>

            {/* <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                活动时间：
              </Col>

              <Col s="12" l="10">
                <RangePicker format={"YYYY/MM/DD"} value={[this.state.starttime, this.state.endtime]} defaultValue={[this.state.starttime, this.state.endtime]} {...init("rangepicker", {
                  getValueFromEvent: this.normRange,
                })}/>
                <IceFormError name="startTime"/>
              </Col>
            </Row> */}

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                学习概要：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="abstract" required={true} message="标题名称必须填写">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="abstract"/>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                所属阶段：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="sid" >
                  <Select className="next-form-text-align"   dataSource={allClassL}/>
                </IceFormBinder>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                主题排序：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="displayorder" required={true} message="标题名称必须填写">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="displayorder"/>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                状态：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="status">
                  <SwitchForForm defaultChecked={this.state.value.activitystatus} onChange={this.onChange}/>
                </IceFormBinder>
              </Col>
            </Row>

            <Row style={styleP}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                主题封面：
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

            <Row style={styleP}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                内容封面：
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
                  }} action={uploadUrl} accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp" name="filename" beforeUpload={this.beforeUpload1} onSuccess={this.onSuccess1} onError={this.onError1}>
                  {
                    this.state.logoImg1
                      ? <Img width={120} height={120} src={this.state.logoImg1} type="cover" style={{
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

            <Row style={styleP}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                标题：
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
                  }} action={uploadUrl} accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp" name="filename" beforeUpload={this.beforeUpload2} onSuccess={this.onSuccess2} onError={this.onError2}>
                  {
                    this.state.logoImg2
                      ? <Img width={120} height={120} src={this.state.logoImg2} type="cover" style={{
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
