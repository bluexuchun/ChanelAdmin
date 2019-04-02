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

const {Row, Col} = Grid;
const {Core} = Upload;
const {DragUpload}=Upload;

const TabPane = Tab.TabPane;
const tabs = [
  { tab: "分类列表", key: 0, content: "/activityClassList"},
  { tab: "分类编辑", key: 1, content: "/activityClass/createClass"},
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

export default class CreateActivityClass extends Component {
  static displayName = 'CreateActivityClass';

  static defaultProps = {};

  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      sorticon:'',
      value: {
        sorttitle:'',
        sortstatus: false,
        sortshow: false,
        fixed: false
      }
    };
  }
  componentDidMount(){
    const activityId = this.props.history.params.activityClassId;
    console.log(activityId);
    // 正确获取到activityId的值，去获取他的值
    ajaxTo('https://app.yongketong.cn/api.php?entry=sys&c=app&a=appsort&do=edit',{'sortid':activityId})
    .then((res)=>{
      console.log(res)
      const currentData=res.data;
      if(activityId != 'createClass'){
        console.log(activityId);
        // 返回的信息
        this.setState({
          value:{
            sorttitle:currentData.sorttitle,
            sortstatus:currentData.sortstatus=='1'?true:false,
            sortshow:currentData.sortshow == '1' ? true : false,
            fixed:currentData.isfixed == '1' ? true : false,
          },
          logoImg:currentData.sorticon
        })
      }else{
        console.log(activityId);
      }
    })

  }

 onError=(file)=> {
    console.log('onError callback : ', file);
  }
  beforeUpload = (info) => {
    console.log('beforeUpload callback : ', info);
  }

  onSuccess = (res, file) => {
    console.log(res)
    Feedback.toast.success('上传成功');
    const logoImg = 'http://' + res.imgURL;
    this.setState({
      logoImg: logoImg
    })
  }
  onFormChange = (value) => {
    // this.setState({value});
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

  tabClick = (key) => {
    const url = tabs[key].content;
    console.log(url);
    this.props.history.router.push(url);
  }

  reset = () => {
    this.setState({
      value: {
        sorttitle:'',
        sortstatus: false,
        sortshow: false,
        fixed: false
      },
      sorticon:''
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
      const dataAry = {...that.formRef.props.value,logoImg:that.state.logoImg,sortid:that.props.history.params.activityClassId};
      const newrequestUrl=that.props.history.params.activityClassId=='createClass'?'api.php?entry=sys&c=app&a=appsort&do=insert':'api.php?entry=sys&c=app&a=appsort&do=update';
      console.log(dataAry);
      const result = ajaxTo(newrequestUrl, dataAry);
      result.then(function(res) {
        //这是成功请求返回的数据
        Feedback.toast.success(res.message);
        setTimeout(function(){
          that.props.history.router.push('/activityClassList');
        },1000);

        console.log(res)
      }, function(value) {
        //这是错误请求返回的信息
      })

      // console.log(this.formRef.props.value.name)
    });
  };

  render() {
    const styleP={
      paddingBottom:'25px'
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
                标题：
              </Col>

              <Col s="12" l="10">
                <IceFormBinder name="sorttitle" required={true} message="标题名称必须填写">
                  <Input style={{
                      width: '100%'
                    }}/>
                </IceFormBinder>
                <IceFormError name="sorttitle"/>
              </Col>
            </Row>



            <Row style={styleP}>
              <Col  xxs="6" s="2" l="2" style={styles.formLabel}>
                icon：
              </Col>
              <Col s="12" l="10">
                  <Upload
                    style={{
                      display: "block",
                      textAlign: "center",
                      width: "120px",
                      height: "120px",
                      border: "none",
                      borderRadius: "5px",
                      fontSize: "12px"
                    }}
                    action='https://app.yongketong.cn/api.php?entry=sys&c=account&a=upload'
                    accept="image/png, image/jpg, image/jpeg, image/gif, image/bmp"
                    name="filename"
                    beforeUpload={this.beforeUpload}
                    onSuccess={this.onSuccess}
                    onError={this.onError}
                  >
                  {this.state.logoImg ?
                    <Img
                      width={120}
                      height={120}
                      src={this.state.logoImg}
                      type="cover"
                      style={{
                        borderRadius:"5px"
                      }}
                    />
                    :
                    <div style={{ width:"120px",height:"120px",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",cursor:"pointer",border:"1px dashed #aaa",borderRadius:"5px"}}>
                      <div style={{ color:"#3080FE",fontSize:"30px",width:"100%",textAlign:"center"}}>+</div>
                      <div style={{ color:"#3080FE",fontSize:"14px",width:"100%",textAlign:"center"}}>上传图片</div>
                    </div>
                  }
                </Upload>
              </Col>
            </Row>
            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                状态：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="sortstatus">
                  <SwitchForForm defaultChecked={this.state.value.sortstatus}/>
                </IceFormBinder>
              </Col>
            </Row>
            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                是否固定：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="fixed">
                  <SwitchForForm defaultChecked={this.state.value.sortshow}/>
                </IceFormBinder>
              </Col>
            </Row>
            <Row style={styles.formItem}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                是否显示：
              </Col>
              <Col s="12" l="10">
                <IceFormBinder name="sortshow">
                  <SwitchForForm defaultChecked={this.state.value.sortshow}/>
                </IceFormBinder>
              </Col>
            </Row>
            <Row style={styles.btns}>
              <Col xxs="6" s="2" l="2" style={styles.formLabel}>

              </Col>
              <Col s="12" l="10">
                <Button type="primary" onClick={this.submit}>
                  {this.props.history.params.activityClassId!='createClass'?'保存':'立即创建'}
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
