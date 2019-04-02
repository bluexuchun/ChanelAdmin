import React, {Component} from 'react';
import axios from 'axios';
import {ajaxTo} from '../../../util/util';
import IceContainer from '@icedesign/container';
import {Feedback} from '@icedesign/base';
import Img from '@icedesign/img';
import {FormBinderWrapper as IceFormBinderWrapper, FormBinder as IceFormBinder, FormError as IceFormError} from '@icedesign/form-binder';
import IcePanel from '@icedesign/panel';
import { Link } from 'react-router';
import {
  Input,
  Button,
  Checkbox,
  Select,
  DatePicker,
  Switch,
  Radio,
  Dialog,
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
export default class LeaveListForm extends Component {
  static displayName = 'LeaveListForm';

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
    const that = this;
    ajaxTo('api.php?entry=sys&c=user&a=userManagement&do=deleteList').then(function(res) {
      console.log(res);
      that.setState({allData: res.data,pageNum:res.totle,currentPageNum:res.psize});
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

submit1=()=>{
  ajaxTo('https://lem.chanel.com.cn/api.php?entry=sys&c=user&a=guide&do=export')

}

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
    this.setState({value});
  };

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
    const toUrl = '/chaptermanage/' + record.id;
    return (<div style={styles.complexTabTableOperation}>
      <div style={aStyle} data-id={record.id} onClick={this.onOpen.bind(this, record.id)}>删除</div>
    </div>);
  };

  deleteId = () => {
    const id=this.state.currentid;
    this.setState({
      visible: false
    });
    // console.log(id);
    ajaxTo('api.php?entry=sys&c=user&a=userManagement&do=listdelete',{'id':id})
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
      ajaxTo('api.php?entry=sys&c=user&a=userManagement&do=deleteList',{page:currentPage})
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
          Worknumber:forData[i].Worknumber,
          counter:forData[i].counter,
          batch:forData[i].batch
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
    if (this.state.getAllClass) {
      var allClassL = [];
      const allClass = this.state.getAllClass.map((item, i) => {
        return allClassL.push({label: item.sorttitle, value: item.id})
      })
    }

    return (<div className="create-activity-form">
      <IceContainer style={styles.container} title="离职管理">
        <IceFormBinderWrapper ref={(formRef) => {
            this.formRef = formRef;
          }} value={this.state.value} onChange={this.onFormChange}>
          <div>


            <IcePanel style={styles.jianxi}>
              <IcePanel.Header>
                离职列表
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
                <li>确认删除该用户?</li>
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
