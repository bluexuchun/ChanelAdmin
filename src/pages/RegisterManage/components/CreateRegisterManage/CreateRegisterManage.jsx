import React, {Component} from 'react';
import axios from 'axios';
import {ajaxTo,baseURL} from '../../../../util/util';
import cookie from 'react-cookies';
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
      url:'',
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
      ajaxTo('api.php?entry=sys&c=generat&a=generat&do=shows',{username:userInfo.admin}).then(function(res) {
        console.log(res);
        if(res.status==1){
          that.setState({
            url:res.data
          })
        }
        // that.setState({getAllClass: res.data})
      })
      // ajaxTo('api.php?entry=sys&c=app&a=column&do=getActivity').then(function(res){
      //   that.setState({getAllActivity:res.data});
      //   console.log(res)
      // })

    }
  // componentDidMount(){
  //   const activityId = this.props.history.params.activityId;
  //   // const activityId=parseInt(numData);
  //   console.log(activityId)
  //   // 正确获取到activityId的值，去获取他的值
  //   if(activityId != 'columnList'&&activityId <0){
  //     ajaxTo('api.php?entry=sys&c=step&a=step&do=edit',{'id':activityId})
  //     .then((res)=>{
  //       console.log(res)
  //       const currentData=res.data;
  //       console.log(activityId);
  //       // 返回的信息
  //       this.setState({
  //         value:{
  //           title:currentData.title,
  //           status:currentData.status=='1'?true:false,
  //           columncontent:currentData.abstract,
  //           columnclass:currentData.class,
  //           displayorder:currentData.displayorder
  //         },
  //         logoImg:currentData.image,
  //         logoImg1:currentData.icons,
  //         columnclass:currentData.type
  //       })
  //     })
  //   }else{
  //     const allClass = this.state;
  //     console.log(allClass);
  //     // this.setState({
  //     //   value:{
  //     //     appclass:this.state.getAllClass,
  //     //   }
  //     // })
  //   }
  // }

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
  ajaxTo('api.php?entry=sys&c=generat&a=generat&do=generats',{username:userInfo.admin})
  .then(function(res){
    console.log(res.data);
    var data=res.data;
    const url=baseURL+data;
    that.setState({
      url:url
    })
    if(res.status==1){
      ajaxTo('api.php?entry=sys&c=generat&a=generat&do=test',{id:res.id,url:url})
      .then(function(res){
        Feedback.toast.success(res.message);
        console.log(res);
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
      <IceContainer title="签到二维码" style={styles.container}>
        {/* <IceFormBinderWrapper onChange={this.onFormChange} ref={(formRef) => {
            this.formRef = formRef;
          }} value={this.state.value}>
          <div>
            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                步骤名称：
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



            {this.props.history.params.activityId=="columncreate"?
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

          }

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                步骤类型：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="type" >
                  <Select className="next-form-text-align" value={this.state.columnclass} onChange={this.onSelChange.bind(this)}  dataSource={alltitleClass}/>
                </IceFormBinder>
              </Col>
            </Row>

            <Row style={{
                'marginBottom' : '10px'
              }}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                banner：
              </Col>
              <Col s="12" l="10" style={{
                  'float' : 'left'
                }}>
                <Upload style={{
                    display: "block",
                    textAlign: "center",
                    width: "120px",
                    height: "120px",
                    border: "none",
                    borderRadius: "5px",
                    fontSize: "12px"
                  }} action='https://lem.chanel.com.cn/api.php?entry=sys&c=upload&a=upload&do=upload' accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp" name="filename" beforeUpload={this.beforeUpload} onSuccess={this.onSuccess} onError={this.onError}>
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
              <div style={{
                  'clear' : 'both'
                }}></div>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                步骤排序：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="displayorder" required={true}  message="步骤名称必须填写">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="displayorder"/>
              </Col>
            </Row>

            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                显示/隐藏:
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="status">
                  <SwitchForForm defaultChecked={this.state.value.status}/>
                </IceFormBinder>
              </Col>
            </Row>


            <Row style={styles.btns}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>

              </Col>
              <Col s="12" l="10">
                <Button type="primary" onClick={this.submit}>
                  {this.props.history.params.activityId != 'columncreate'&&this.props.history.params.activityId <0 ? '保存' : '立即创建'}
                </Button>
                <Button style={styles.resetBtn} onClick={this.reset}>
                  重置
                </Button>
              </Col>
            </Row>
          </div>
        </IceFormBinderWrapper> */}
        <Row style={styles.formItem}>
          <Col xxs="6" s="2" l="2" style={styles.formLabel}>
            点击生成二维码：
          </Col>

          <Col s="12" l="10">
            <Button type="primary" onClick={this.createCod}>
              生成二维码
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
