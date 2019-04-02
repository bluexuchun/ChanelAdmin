import React, {Component} from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import {ajaxTo,baseURL} from '../../../../util/util';
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
} from '@icedesign/base';
import IceImg from '@icedesign/img';
// import Img from '@icedesign/img';
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

export default class CreateTestcode extends Component {

  static displayName = 'CreateTestcode';

  static defaultProps = {};

  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      num:0,
      url:'',
      url1:'',
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
      const userInfo=cookie.load('userInfo');
      const that = this;
      let url,url1;
      ajaxTo('api.php?entry=sys&c=generat&a=generat&do=show',{
        gid:that.props.history.params.id,
        num:that.state.num
      }).then((res) => {
        this.setState({
          url:res.data.surl,
          url1:res.data.url
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
createCod=()=>{
  const userInfo=cookie.load('userInfo');
  var that=this;
  const num=this.state.num;
  const urli=baseURL+'api.php?entry=sys&c=generat&a=generat&do=show&gid='+that.props.history.params.id+'&num='+num+1;
  ajaxTo('api.php?entry=sys&c=generat&a=generat&do=generat',{username:userInfo.admin,gid:that.props.history.params.id})
  .then(function(res){
    Feedback.toast.success(res.message);
    console.log(res.data);
    var data=res.data;
    const url=baseURL+data;
    // that.setState({
    //   url:url
    // })
    if(res.status==1){
      ajaxTo('api.php?entry=sys&c=generat&a=generat&do=test',{id:that.props.history.params.id,url:url})
      .then(function(res){
        Feedback.toast.success(res.message);
        that.setState({
          num:num+1,
          url:urli
        })
        console.log(that.state.url);
      })
    }
  })
}

createCod1=()=>{
  const userInfo=cookie.load('userInfo');
  var that=this;
  const num=this.state.num;
  const urli=baseURL+'api.php?entry=sys&c=generat&a=generats&do=shows&gid='+that.props.history.params.id+'&num='+num+1;
  ajaxTo('api.php?entry=sys&c=generat&a=generats&do=generats',{username:userInfo.admin,gid:that.props.history.params.id})
  .then(function(res){
    Feedback.toast.success(res.message);
    console.log(res.data);
    var data=res.data;
    const url=baseURL+data;
    if(res.status==1){
      ajaxTo('api.php?entry=sys&c=generat&a=generats&do=test1',{id:that.props.history.params.id,url:url})
      .then(function(res){
        Feedback.toast.success(res.message);
        console.log(res);
        that.setState({
          num:num+1,
          url1:urli
        })
      })
    }
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
      const dataAry = {...that.formRef.props.value,id:this.props.history.params.activityId,sid:this.state.jieduanclass,logoImg:this.state.logoImg,type:this.state.columnclass}
      console.log(dataAry);

      //修改区
      const newrequestUrl=this.props.history.params.activityId=='columncreate'?'api.php?entry=sys&c=step&a=step&do=update':'api.php?entry=sys&c=step&a=step&do=update';
      console.log(newrequestUrl);
      const result =ajaxTo(newrequestUrl, dataAry);
      result.then(function(res) {
        //这是成功请求返回的数据
        Feedback.toast.success(res.message);
        setTimeout(function(){
          that.props.history.router.push('/columnList');
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
        label: "浏览产品网页",
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
                    label: item.daytitle,
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
      <IceContainer title="二维码" style={styles.container}>
      <Row style={styles.formItem}>
        <Col xxs="6" s="2" l="2" style={styles.formLabel}>
          点击生成签到二维码：
        </Col>

        <Col s="12" l="10">
          <Button type="primary" onClick={this.createCod1}>
            生成签到二维码
          </Button>
        </Col>
      </Row>
      <Row style={{
          'marginBottom' : '10px'
        }}>
        <Col xxs="6" s="2" l="2" style={styles.formLabel}>
          二维码：
        </Col>
        <Col s="12" l="10" style={{
            'float' : 'left'
          }}> <div style={{
                      width: "240px",
                      height: "240px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      border: "1px dashed #aaa",
                      borderRadius: "5px"
                    }}>
                    {this.state.url1==''?null:<img style={{width: "100%",height: "100%"}} src={this.state.url1} />}
                    {/* <div style={{
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
                      }}>上传图片</div> */}
                  </div>

        </Col>
        <div style={{
            'clear' : 'both'
          }}></div>
      </Row>

        <Row style={styles.formItem}>
          <Col xxs="6" s="2" l="2" style={styles.formLabel}>
            点击生成考试二维码：
          </Col>

          <Col s="12" l="10">
            <Button type="primary" onClick={this.createCod}>
              生成考试二维码
            </Button>
          </Col>
        </Row>
        <Row style={{
            'marginBottom' : '10px'
          }}>
          <Col xxs="6" s="2" l="2" style={styles.formLabel}>
            二维码：
          </Col>
          <Col s="12" l="10" style={{
              'float' : 'left'
            }}> <div style={{
                        width: "240px",
                        height: "240px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        border: "1px dashed #aaa",
                        borderRadius: "5px"
                      }}>
                      {this.state.url==''?null:<img style={{width: "100%",height: "100%"}} src={this.state.url} />}
                    </div>

          </Col>
          <div style={{
              'clear' : 'both'
            }}></div>
        </Row>




      </IceContainer>

    </div>);
  }
}

const styles = {
  container: {
    paddingBottom: 0
  },
  formItem: {
    marginTop:'25px',
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
