import React, {Component} from 'react';
import cookie from 'react-cookies';
import axios from 'axios';
import {ajaxTo,baseURL} from '../../../util/util';
import IceContainer from '@icedesign/container';
import {Feedback} from '@icedesign/base';
import Img from '@icedesign/img';
import {FormBinderWrapper as IceFormBinderWrapper, FormBinder as IceFormBinder, FormError as IceFormError} from '@icedesign/form-binder';
import IcePanel from '@icedesign/panel';
import { Link } from 'react-router';
import {
  Icon,
  Input,
  Button,
  Checkbox,
  Select,
  Dialog,
  DatePicker,
  Switch,
  Radio,
  Grid,
  Upload,
  Tab,
  Table,
  Pagination
} from '@icedesign/base';

const {Row, Col} = Grid;
const {Core} = Upload;
const {DragUpload} = Upload;
const TabPane = Tab.TabPane;


// FormBinder 用于获取表单组件的数据，通过标准受控 API value 和 onChange 来双向操作数据
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const {RangePicker} = DatePicker;
// const { Group: RadioGroup } = Radio;

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
const onRowClick = function(record, index, e) {
  console.log(record)

}
const aStyle={
  display:"inline-block",
  color:"#5485F7",
  marginLeft:"1rem",
  cursor:'pointer'
}
export default class UserSettingForm extends Component {
  static displayName = 'UserSettingForm';

  static defaultProps = {};

  constructor(props) {
    super(props);
        this.queryCache = {};
    console.log(this.props);
    this.state = {
      logoImg: '',

      value: {
        isapp: false,
        appstatus: false,
        appid: '',
        apprecommend: false,
        appbibei: false,

      },
      QRcode:'boss',
      chit:'date',
      homestyle:'list',
      getAllClass: "",
      visible: false,
    };
    // this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    const userInfo=cookie.load('userInfo');
    const that = this;
    ajaxTo('api.php?entry=sys&c=user&a=userManagement&do=userlist').then(function(res) {
      console.log(res);
      that.setState({allData: res.data,pageNum:res.totle,currentPageNum:res.psize,username:userInfo.admin});
    })
  }

  // componentDidMount(){
  //   const activityId = this.props.history.params.activityId;
  //    正确获取到activityId的值，去获取他的值
  //   if(activityId != 'create'){
  //     ajaxTo('https://app.yongketong.cn/api.php?entry=sys&c=app&a=regulation&do=edit',{'id':activityId})
  //     .then((res)=>{
  //       console.log(res)
  //       const currentData=res.data;
  //       console.log(currentData);
  //        返回的信息
  //       this.setState({
  //         value:{
  //           appname:currentData.appname,
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
onOpen = (id) => {
  console.log(id);
  this.setState({
    visible: true,
    currentid:id,
  });
};

onOK=()=>{
  this.setState({
    visible: false
  });
}

onClose = () => {
  console.log('!!!');
  this.setState({
    visible: false,
  });
};



qishuChange=(value,option)=>{
  const that=this;
  console.log(value,option);
  ajaxTo('api.php?entry=sys&c=user&a=userManagement&do=userlist',{sort:value})
  .then(function(res){
    console.log(res);
    that.setState({
      allData:res.data
    })
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
    console.log(value);
    this.setState({value});
  };
  submit=()=>{
    const that=this;
    console.log(this.state.value);
    ajaxTo('api.php?entry=sys&c=user&a=userManagement&do=userlist',{keyword:this.state.value.appname})
    .then(function(res){
      console.log(res);
      that.setState({
        allData:res.data
      })
    })
  }
  onDragOver = () => {
    console.log("dragover callback");
  }

  onDrop = (fileList) => {
    console.log("drop callback : ", fileList);
  }
  getIcon = (appicon) => {
    console.log(appicon);
    return (<img src={appicon} style={{
        width: '28px'
      }} className="media-side"/>)
  }


    renderOperations = (value, index, record) => {
      const toUrl = '/usersetting/' + record.id;
      const toDetail = '/userdetail/' + record.id
      return (<div style={styles.complexTabTableOperation}>
        <Link to={toUrl}>编辑</Link>
        <div style={aStyle} data-id={record.id} onClick={this.onOpen.bind(this, record.id)}>离职</div>
        <Link style={aStyle} to={toDetail}>查看学员信息</Link>
      </div>);
    };

    deleteId = () => {
      const id=this.state.currentid;
      this.setState({
        visible: false
      });
      // console.log(id);
      ajaxTo('api.php?entry=sys&c=user&a=userManagement&do=delete',{'id':id})
      .then(function(res){
        Feedback.toast.success(res.message);
      })
      let oldData=this.state.allData;
      for (var i = 0; i < oldData.length; i++) {
        if(oldData[i].id==id){
          oldData.splice(i,1);
          this.setState({
            allData:oldData
          })
        }
      }
      // let newCurrenData=this.state.allData.splice

    }

    changePage = (currentPage) => {
      this.queryCache.page = currentPage;
          console.log(this.queryCache.page);
      const that=this;
      console.log(currentPage);
      ajaxTo('api.php?entry=sys&c=user&a=userManagement&do=userlist',{page:currentPage})
      .then(function(res){
        console.log(res)
        that.setState({
          currentPage:currentPage,
          allData:res.data

        })
      })

    };


      onSubCategoryClick = (catId) => {
        this.setState({currentCategory: catId});
        this.queryCache.catId = catId;
        this.fetchData();
      };
  render() {
    const defultClass = this.state.getAllClass;
    let forData = this.state.allData;
    const arr = [];
    if (forData) {
      for (var i = 0; i < forData.length; i++) {

        arr.push({
          'name':forData[i].username,
          'icon': forData[i].headimgurl,
          'nname': forData[i].nickname,
          'createtime': forData[i].date,
          'id': forData[i].id,
          'status': forData[i].status,
          'appicon': forData[i].cover,
          'tel':forData[i].phone,
          'city':forData[i].city,
          'Worknumber':forData[i].Worknumber,
          'counter':forData[i].counter,
          'batch':forData[i].batch
        })
      }
    }
    const tableData = {
      'currentPage': this.state.currentPage,
      'pageSize': this.state.currentPageNum,
      'data': arr,
      total:this.state.pageNum
    }

    const styleP = {
      paddingBottom: '25px'
    }
    const allClassL=[
      {
        label:"入职时间/降序",
        value:'1'
      },
      {
        label:"入职时间/升序",
        value:'2'
      },
      {
        label:"期数/降序",
        value:'3'
      },
      {
        label:"期数/升序",
        value:'4'
      },

    ];
    const username=this.state.username;
    return (<div className="create-activity-form">
      <IceContainer style={styles.container} title="用户管理">
        <IceFormBinderWrapper ref={(formRef) => {
            this.formRef = formRef;
          }} value={this.state.value} onChange={this.onFormChange}>
          <div>

            <IcePanel style={{
              marginTop: "25px"
            }}>
              <IcePanel.Header>
               用户导入或导出{/* 共计{tableData.total}条数据 */}
              </IcePanel.Header>
              <IcePanel.Body>
                <Row style={styles.btns}>

                  <Col s="4" l="2">
                    <a type="primary" href={baseURL+'/excel/20180724.xlsx'} style={{display:"block",width:"85px",height:"28px",backgroundColor:"#2077FF",textAlign:"center",lineHeight:"28px",borderRadius:"50px",fontSize:"14px",color:"#fff"}}>
                      模板下载
                    </a>

                  </Col>
                  <Col s="4" l="2">
                    <a type="primary" href={username!='admin' ? baseURL + "api.php?entry=sys&c=user&a=guide&do=allexport" : baseURL + "api.php?entry=sys&c=user&a=guide&do=allexport"} style={{display:"block",width:"85px",height:"28px",backgroundColor:"#2077FF",textAlign:"center",lineHeight:"28px",borderRadius:"50px",fontSize:"14px",color:"#fff"}}>
                      导出
                    </a>

                  </Col>
                  <Col s="4" l="2">
                      <Upload
                        // style={{
                        //   display: "block",
                        //   textAlign: "center",
                        //   width: "120px",
                        //   height: "120px",
                        //   border: "none",
                        //   borderRadius: "5px",
                        //   fontSize: "12px"
                        // }}
                        action={baseURL + 'api.php?entry=sys&c=user&a=guide&do=Imexcel'}
                        name="filename"
                        beforeUpload={this.beforeUpload}
                        onSuccess={this.onSuccess}
                        onError={this.onError}
                      >    
                      <Button type="primary"  style={{marginRight:"20px"}}>
                        上传文件
                      </Button>
                    </Upload>
                  </Col>
                  <Col s="4" l="2">
                    <a type="primary" href={baseURL + 'api.php?entry=sys&c=user&a=stepExple&do=export_stage1'} style={{display:"block",width:"100px",height:"28px",backgroundColor:"#2077FF",textAlign:"center",lineHeight:"28px",borderRadius:"50px",fontSize:"14px",color:"#fff"}}>
                      导出第一阶段
                    </a>

                  </Col>
                  <Col s="4" l="2">
                    <a type="primary" href={baseURL + 'api.php?entry=sys&c=user&a=stepExple&do=export_stage2'} style={{display:"block",width:"100px",height:"28px",backgroundColor:"#2077FF",textAlign:"center",lineHeight:"28px",borderRadius:"50px",fontSize:"14px",color:"#fff"}}>
                      导出过渡期
                    </a>

                  </Col>
                  <Col s="4" l="2">
                    <a type="primary" href={baseURL + 'api.php?entry=sys&c=user&a=stepExple&do=export_stage3'} style={{display:"block",width:"100px",height:"28px",backgroundColor:"#2077FF",textAlign:"center",lineHeight:"28px",borderRadius:"50px",fontSize:"14px",color:"#fff"}}>
                      导出第二阶段
                    </a>

                  </Col>
                </Row>

                <Row style={styles.formItem}>


                  <Col s="12" l="10">
                    <Feedback key='prompt' title="上传文件" type='prompt' shape='toast'>
                      您所上传的文件可能会覆盖之前的用户信息,请您仔细检查后再进行上传
                    </Feedback>
                  </Col>
                </Row>



              </IcePanel.Body>
            </IcePanel>

            <IcePanel style={{
              marginTop: "25px"
            }}>
            <IcePanel.Header>
              筛选
            </IcePanel.Header>
            <IcePanel.Body>
              <IceFormBinderWrapper ref={(formRef) => {
                  this.formRef = formRef;
                }} value={this.state.value} onChange={this.onFormChange}>
                <div>
                  <Row style={styles.formItem1}>
                    <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                      期数筛选：
                    </Col>
                    <Col s="12" l="10">
                      <IceFormBinder name="appclass">
                        <Select className="next-form-text-align" defaultValue={this.state.value.appclass}  dataSource={allClassL} onChange={this.qishuChange}/>
                      </IceFormBinder>
                    </Col>
                  </Row>




                </div>
              </IceFormBinderWrapper>
            </IcePanel.Body>
          </IcePanel>


          <IcePanel  style={{
            marginTop: "25px"
          }}>
          <IcePanel.Header>
            搜索
          </IcePanel.Header>
          <IcePanel.Body>
            <IceFormBinderWrapper ref={(formRef) => {
                this.formRef = formRef;
              }} value={this.state.value} onChange={this.onFormChange}>
              <div>
                {/* <Row style={styles.formItem}>
                  <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                    期数筛选：
                  </Col>
                  <Col s="12" l="10">
                    <IceFormBinder name="appclass">
                      <Select className="next-form-text-align"  dataSource={allClassL} onChange={this.qishuChange}/>
                    </IceFormBinder>
                  </Col>
                </Row> */}

                <Row style={styles.formItem1}>
                  <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                    搜索内容：
                  </Col>

                  <Col s="12" l="10">
                    <IceFormBinder name="appname">
                      <Input placeholder="姓名/手机号/工号" style={{
                          width: '100%'
                        }}/>
                    </IceFormBinder>
                    <IceFormError name="appname"/>
                  </Col>
                </Row>
                <Row style={styles.btns}>
                  <Col xxs="6" s="2" l="2" style={styles.formLabel}>

                  </Col>
                  <Col s="12" l="10">

                    <Button type="primary" onClick={this.submit}>
                      <Icon type="search" size="xs" />
                      搜索
                    </Button>

                  </Col>
                </Row>


              </div>
            </IceFormBinderWrapper>
          </IcePanel.Body>
        </IcePanel>



            <IcePanel style={{
              marginTop: "25px"
            }}>
              <IcePanel.Header>
                共计{tableData.total}条数据
              </IcePanel.Header>
              <IcePanel.Body>
                <Dialog
                visible = {
                  this.state.visible
                }
                onOk = {
                  this.deleteId
                }
                closable = "esc,mask,close"
                onCancel = {
                  this.onClose
                }
                onClose = {
                  this.onClose
                }
                title = "提示框" > <h3></h3>
                <ul>
                  <li>确认该用户已离职?</li>
                  {/* <li>Negotiate the details of your order</li> */}
                </ul>
                </Dialog>


                <Table dataSource={tableData.data} isLoading={tableData.__loading} className="basic-table" style={styles.basicTable} hasBorder={false} onRowClick={onRowClick}>
                  {/* <Table.Column title="昵称" width={100} dataIndex="nname"/> */}
                  {/* <Table.Column title="头像" dataIndex="icon" width={85}  cell={this.getIcon}></Table.Column> */}
                  <Table.Column title="姓名" width={220} dataIndex="name"/>
                  <Table.Column title="手机号" dataIndex="tel" width={150}/>
                  <Table.Column title="工号" width={100} dataIndex="Worknumber"/>
                  <Table.Column title="柜台" width={100} dataIndex="counter"/>
                  <Table.Column title="期数" width={100} dataIndex="batch"/>
                  <Table.Column title="城市" width={100} dataIndex="city"/>
                  {/* <Table.Column title="支付宝号" dataIndex="zhifubao" width={85} cell={this.renderStatus}/> */}
                  <Table.Column title="入职时间" width={100} dataIndex="createtime"/>
                  <Table.Column title="操作" dataIndex="operation" width={150} cell={this.renderOperations}/>
                </Table>
                <div style={styles.pagination}>
                  <Pagination current={tableData.currentPage} pageSize={tableData.pageSize} total={tableData.total} onChange={this.changePage}/>
                </div>
              </IcePanel.Body>
            </IcePanel>


          </div>



        </IceFormBinderWrapper>
      </IceContainer>
    </div>);
  }
}

const styles = {
  jianxi:{
    marginBottom:"25px"
  },
  container: {
    paddingBottom: 0
  },
  formItem: {
    height: '28px',
    lineHeight: '28px',
    marginTop: '25px',
    marginBottom: '10px'
  },
  huise: {
    color: '#CFCFCF'
  },
  formLabel: {
    textAlign: 'right'
  },
  btns: {
    margin: '25px 0'
  },
  resetBtn: {
    marginLeft: '20px'
  },
  formItem: {
    height: '28px',
    lineHeight: '28px',
    marginBottom: '25px'
  },
  formItem1: {
    height: '28px',
    lineHeight: '28px',
  },
  formLabel: {
    textAlign: 'right'
  },

  complexTabTableOperation: {
    lineHeight: '28px'
  },
  titleWrapper: {
    display: 'flex',
    flexDirection: 'row'
  },
  title: {
    marginLeft: '10px',
    lineHeight: '20px'
  },
  operation: {
    marginRight: '12px',
    textDecoration: 'none'
  },
  tabExtra: {
    display: 'flex',
    alignItems: 'center'
  },
  search: {
    marginLeft: 10
  },
  tabCount: {
    marginLeft: '5px',
    color: '#3080FE'
  },
  pagination: {
    textAlign: 'right',
    paddingTop: '26px'
  }
};
