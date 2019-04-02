import React, {Component} from 'react';
import axios from 'axios';
import {ajaxTo,uploadUrl} from '../../../../util/util';
import IceContainer from '@icedesign/container';
import {Feedback, Field} from '@icedesign/base';
import Img from '@icedesign/img';
import {connect} from 'react-redux';
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

@connect(state=>({user:state.user}))

export default class CreateHiddenFileForm extends Component {
  field = new Field(this);
  static displayName = 'CreateHiddenFileForm';

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

  }
  //编辑的活动数据
  componentDidMount() {

  }

  onChange(checked) {
    var that = this;
    const nameValue = that.props.name;
    console.log(checked)
    console.log(nameValue);
    this.setState({value: {}})
  }





  onFormChange = (value) => {
    console.log(value);
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
      console.log(this.state.value);


      const result = ajaxTo('api.php?entry=sys&c=tablename&a=table&do=table', {...this.state.value,username:this.props.user.admin});
      result.then(function(res) {
        console.log(res)
        //这是成功请求返回的数据
        Feedback.toast.success(res.message);


      }, function(value) {
        //这是错误请求返回的信息
      })

      console.log(this.formRef.props.value.name)
    });
  };

  render() {
    const init = this.field.init;
    const defultClass = this.state.getAllClass;

    const styleP = {
      paddingBottom: '25px'
    }
    // if (this.state.getAllClass) {
    //   var allClassL = [];
    //   const allClass = this.state.getAllClass.map((item, i) => {
    //     return allClassL.push({label: item.title, value: item.id})
    //   })
    // }
var allClassL = [
  {label: '未开始', value: 0},
  {label: '进行中', value: 1},
  {label: '已完成', value: 2}
];
var currentstatus=this.state.currentstatus;
    return (<div className="create-activity-form">
      <IceContainer title="　" style={styles.container}>
        <IceFormBinderWrapper ref={(formRef) => {
            this.formRef = formRef;
          }} value={this.state.value} onChange={this.onFormChange}>
          <div>

          <Row style={styles.formItem}>
            <Col xxs="6" s="2" l="2" style={styles.formLabel}>
              验证密码：
            </Col>

            <Col s="12" l="10">
              <IceFormBinder name="password">
                <Input placeholder="" style={{
                    width: '100%'
                  }}/>
              </IceFormBinder>
              <IceFormError name="password"/>
            </Col>
          </Row>

          <Row style={styles}>
            <Col xxs="6" s="2" l="2" style={styles.formLabel}>
              SQL语句：
            </Col>

            <Col s="12" l="10">
              <IceFormBinder name="sql">
                <Input placeholder="" multiple style={{
                    width: '100%'
                  }}/>
              </IceFormBinder>
              <IceFormError name="sql"/>
            </Col>
          </Row>











            <Row style={styles.btns}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}></Col>
              <Col s="12" l="10">
                <Button type="primary" onClick={this.submit}>
                    提交
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
    paddingBottom: 0,
    height:'800px'
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
