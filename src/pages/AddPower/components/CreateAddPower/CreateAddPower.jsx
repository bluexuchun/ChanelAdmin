import React, {Component} from 'react';
import axios from 'axios';
import {ajaxTo,uploadUrl} from '../../../../util/util';
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
  Upload
} from '@icedesign/base';

const {Row, Col} = Grid;
const {Core} = Upload;
const {DragUpload}=Upload;

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

export default class CreateAddPower extends Component {
  static displayName = 'CreateAddPower';

  static defaultProps = {};

  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      logoImg:'',
      value: {
        columnname:'',
        status: false,
        columnclass:'',
        activityclass:''
      },
      getAllClass:""
    };
  }

    //请求全部的活动分类
    componentWillMount() {
      const that = this;
      ajaxTo('api.php?entry=sys&c=adminList&a=admin&do=getRole').then(function(res) {
        console.log(res.data);
        that.setState({getAllClass: res.data})
      })
      // ajaxTo('api.php?entry=sys&c=app&a=column&do=getActivity').then(function(res){
      //   that.setState({getAllActivity:res.data});
      //   console.log(res)
      // })

    }
  componentDidMount(){
    const activityId = this.props.history.params.id;
    // const activityId=parseInt(numData);
    console.log(activityId)
    // 正确获取到activityId的值，去获取他的值
      ajaxTo('api.php?entry=sys&c=adminList&a=admin&do=roleEdit',{'aid':activityId})
      .then((res)=>{
        console.log(res)
        const currentData=res.data;
        console.log(activityId);
        // 返回的信息
        this.setState({
          value:{
            title:currentData.name,
          },
          columnclass:currentData.id
        })
      })

  }

  onChange(checked) {
    var that = this;
    const nameValue = that.props.name;
    console.log(checked)
    console.log(nameValue);
    this.setState({value: {}})
  }


 onError=(file)=> {
    console.log('onError callback : ', file);
  }
  onError1 = (file) => {
    console.log('onError callback : ', file);
  }
  beforeUpload = (info) => {
    console.log('beforeUpload callback : ', info);
  }
  beforeUpload1 = (info) => {
    console.log('beforeUpload callback : ', info);
  }

  onSuccess = (res, file) => {
    console.log(res)
    Feedback.toast.success('上传成功');
    const logoImg = 'http://' + res.imgURL;

    this.setState({
      logoImg: logoImg,
    })
  }
  onSuccess1=(res,file)=>{
      Feedback.toast.success('上传成功');
      const logoImg1='http://'+res.imgURL;
      this.setState({
        logoImg1:logoImg1
      })
  }
  onFormChange = (value) => {
    this.setState({value});

    console.log(this.state.value.activityclass);
    console.log(value)
    this.setState({
      value:{
        title:value.title,
        status:value.status,
        displayorder:value.displayorder,
        type:value.type,

      }
    })
  };

  onDragOver= () =>{
    console.log("dragover callback");
  }

  onDrop= (fileList) => {
    console.log("drop callback : ", fileList);
  }
  onFileChange=(file)=>{
    // console.log(file.file.imgURL);
    const iconImg = 'https://lem.chanel.com.cn/'+file.file.imgURL;
    console.log(iconImg);
    // this.setState({
    //   iconImg
    // })
  }
onSelChange(value){
  console.log(value);
  this.setState({
    columnclass:value
})
};
onSelChange1=(value)=>{
  console.log(value);
  this.setState({
    jieduanclass:value
  })
}
  reset = () => {
    this.setState({
      value: {
        columnname:'',
        columnstatus: false,
        'columncontent':'',
        columnclass:'',
        activityclass:''

      },
      logoImg:'',
      logoImg1:''
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
      console.log(that.formRef);

      //
      const dataAry = {...that.formRef.props.value,aid:this.props.history.params.id,sid:this.state.columnclass}
      console.log(dataAry);

      //修改区
      const newrequestUrl=this.props.history.params.activityId=='columncreate'?'api.php?entry=sys&c=adminList&a=admin&do=roleUpdate':'api.php?entry=sys&c=adminList&a=admin&do=roleUpdate';
      console.log(newrequestUrl);
      const result =ajaxTo(newrequestUrl, dataAry);
      result.then(function(res) {
        //这是成功请求返回的数据
        Feedback.toast.success(res.message);
        setTimeout(function(){
          that.props.history.router.push('/administratorslist');
        },2000);
        console.log(res)
      }, function(value) {
        //这是错误请求返回的信息
      })

      // console.log(this.formRef.props.value.name)
    });
  };

  render() {
    const alltitleClass=[
      {
        label: "体验产品",
        value: "0"
      },
      {
        label: "阅读产品手册",
        value: "1"
      },
      {
        label: "观看产品视频",
        value: "2"
      },
      {
        label: "小测试",
        value: "3"
      },
    ]

    const styleP={
      paddingBottom:'25px'
    }
    if(this.state.getAllClass){
      var allClassL=[];
      this.state.getAllClass.map((item,i)=>{
        return allClassL.push({
                    label: item.name,
                    value: item.id
                  })
      })
    }
    // console.log(this.state.getAllActivity)
    // if(this.state.getAllActivity){
    //   var allActivityData=[];
    //   this.state.getAllActivity.map((item,i)=>{
    //     console.log(item)
    //     return allActivityData.push({
    //                 label:item.title,
    //                 value: item.id
    //               })
    //   })
    //   console.log(allActivityData)
    // }
    // cosnole.log
    return (<div className="create-activity-form">
      <IceContainer title="角色分配" style={styles.container}>
        <IceFormBinderWrapper onChange={this.onFormChange} ref={(formRef) => {
            this.formRef = formRef;
          }} value={this.state.value}>
          <div>
            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                账号：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="title" required={true}  message="步骤名称必须填写">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="title"/>
              </Col>
            </Row>



            {/* {this.props.history.params.activityId=="columncreate"?
            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                所属主题：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="activityclass" >
              <Select className="next-form-text-align" value={this.state.jieduanclass} onChange={this.onSelChange1.bind(this)}  dataSource={allClassL}/>
                </IceFormBinder>
              </Col>
            </Row>
            :
            null

          } */}

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                角色选择：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="type" >
                  <Select className="next-form-text-align" value={this.state.columnclass} onChange={this.onSelChange.bind(this)}  dataSource={allClassL}/>
                </IceFormBinder>
              </Col>
            </Row>





            <Row style={styles.btns}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>

              </Col>
              <Col s="12" l="10">
                <Button type="primary" onClick={this.submit}>
                  {this.props.history.params.activityId != 'columncreate'&&this.props.history.params.activityId <0 ? '保存' : '保存'}
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
