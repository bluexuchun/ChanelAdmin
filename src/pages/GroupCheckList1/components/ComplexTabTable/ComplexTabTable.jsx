/* eslint no-underscore-dangle:0 */
import React, {Component} from 'react';
import {Switch,Table, Pagination, Tab, Search} from '@icedesign/base';
import {

  Input,
  Dialog,
  Button,
  Select,
  DatePicker,
  Grid,
  Icon
} from '@icedesign/base';
import IceContainer from '@icedesign/container';
import {connect} from 'react-redux';
import IceImg from '@icedesign/img';
import DataBinder from '@icedesign/data-binder';
import IceLabel from '@icedesign/label';
import {enquireScreen} from 'enquire-js';
import SubCategoryItem from './SubCategoryItem';
import './ComplexTabTable.scss';
import {Link} from 'react-router'
import {ajaxTo} from '../../../../util/util';
import Img from '@icedesign/img';
import IcePanel from '@icedesign/panel';
import {Feedback} from '@icedesign/base';
import {FormBinderWrapper as IceFormBinderWrapper, FormBinder as IceFormBinder, FormError as IceFormError} from '@icedesign/form-binder';

const aStyle = {
  display: "inline-block",
  color: "#5485F7",
  marginLeft: "1rem",
  cursor: 'pointer'
}
const onRowClick = function(record, index, e) {
  console.log(record)

}
const TabPane = Tab.TabPane;
const {Row, Col} = Grid;
const tabs = [
  {
    tab: "学员列表",
    key: 0,
    content: "/topicmanagelist"
  }
];

@connect(state=>({user:state.user}))

export default class ComplexTabTable extends Component {
  static displayName = 'ComplexTabTable';

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.queryCache = {};
    this.state = {
      rowSelection: {
  onChange: this.onChange.bind(this),
  onSelect: function(selected, record, records) {
    console.log("onSelect", selected, record, records);
  },
  onSelectAll: function(selected, records) {
    console.log("onSelectAll", selected, records);
  },
  selectedRowKeys: [],
  getProps: record => {
    return {
      disabled: record.id === 100306660941
    };
  }
},
      currentPage:1,
      isMobile: false,
      currentTab: 'solved',
      currentCategory: 1,
      visible: false,
      visible1: false

    };
  }

  componentWillMount() {
    console.log(this.props);
    const that = this;
    const result = ajaxTo('api.php?entry=sys&c=teacher1&a=group&do=student',{id:this.props.newData.history.params.id,username:that.props.user.admin});
    result.then(function(res) {
      console.log(res.data)

      that.setState({allData: res.data,pageNum:res.data.totle,currentPageNum:res.data.psize});
    })
  }
  //
  // componentDidMount() {}

  tabClick = (key) => {
    const url = tabs[key].content;
    console.log(url);
    this.props.newData.history.router.push(url);
  }

  renderTitle = (value, index, record) => {
    return (<div style={styles.titleWrapper}>
      <div>
        <IceImg src={record.cover} width={48} height={48}/>
      </div>
      <span style={styles.title}>{record.title}</span>
    </div>);
  };
  //弹窗
  onOpen = (id) => {
    console.log(id);
  this.setState({
    visible: true,
    currentid:id,
  });
};

onOpen1 = (id) => {
  console.log(id);
this.setState({
  visible1: true,
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
    visible1:false
  });
};
deleteId1 = () => {
  const that=this;
  console.log('11111');
  const id=this.state.currentid;
  this.setState({
    visible1: false
  });
  console.log(id);
  ajaxTo('api.php?entry=sys&c=teacher1&a=group&do=adopt', {'id': id,username:that.props.user.admin}).then((res)=>{
    console.log(res);

    const result = ajaxTo('api.php?entry=sys&c=teacher1&a=group&do=student',{id:this.props.newData.history.params.id,username:that.props.user.admin});
    result.then(function(res) {
      Feedback.toast.success(res.message);
      console.log(res.data)

      that.setState({allData: res.data,pageNum:res.data.totle,currentPageNum:res.data.psize});
    })
  });
  // let newCurrenData=this.state.allData.splice
  this.setState({
    visible1: false
  });
}
  deleteId = () => {
    const that=this;
    const id=this.state.currentid;

    this.setState({
      visible: false
    });
    console.log(id);
    ajaxTo('api.php?entry=sys&c=teacher1&a=group&do=del', {'id': id,username:that.props.user.admin}).then((res)=>{
      console.log(res);
      Feedback.toast.success(res.message);

    });
    let oldData = this.state.allData;
    for (var i = 0; i < oldData.length; i++) {
      if (oldData[i].id == id) {
        oldData.splice(i, 1);
        this.setState({allData: oldData})
      }
    }
    // let newCurrenData=this.state.allData.splice
    this.setState({
      visible: false
    });
  }

  onChange(ids, records) {
    console.log(ids,records);
  let { rowSelection } = this.state;
  rowSelection.selectedRowKeys = ids;
  console.log("onChange", ids, records);
  this.setState({ allsel:ids });
}

  editItem = (record, e) => {
    e.preventDefault();
    // TODO: record 为该行所对应的数据，可自定义操作行为
  };

  renderOperations = (value, index, record) => {
    let that = this
    console.log(value,index,record);
    const toUrl = '/topicmanage/' + record.id;
    return (<div style={styles.complexTabTableOperation}>
      {/* <Link to={toUrl}>编辑</Link> */}
      {that.props.user.admin == 'admin' ? 
        <Button type="primary" disabled={value?true:false} onClick={this.onOpen1.bind(this,record.id)}>
          {value?"已通过":"通过"}
        </Button>
        :
        value ? 
        <Button type="primary" disabled={true}>
          已通过
        </Button> : null
      }
      
      {/* onClick={this.deleteId.bind(this, record.id)} */}
      <div style={aStyle} data-id={record.id} onClick={this.onOpen.bind(this,record.id)} >删除</div>
    </div>);
  };

  // renderStatus = (value) => {
  //   return (<IceLabel inverse={false} status="default">
  //     {value}
  //   </IceLabel>);
  // };

  renderStatus = (value) => {
    return (<Switch inverse={false} checked={value} status="default">

    </Switch>);
  };

  rendStatus = (value) => {
    console.log(value)
    return (
      (value == 0 ? <div style={{color:'#3ecd59'}}>正常</div> : <div style={{color:'#ff0000'}}>已离职</div>)
      
    )
  }

  changePage = (currentPage) => {

    this.queryCache.page = currentPage;
    const that=this;
    console.log(currentPage);
    ajaxTo('api.php?entry=sys&c=stage&a=stage&do=list',{page:currentPage,username:that.props.user.admin})
    .then(function(res){
      console.log(res)
      that.setState({
        currentPage:currentPage,
        allData:res.data.data

      })
    })

  };

  onSubCategoryClick = (catId) => {
    this.setState({currentCategory: catId});
    this.queryCache.catId = catId;
    this.fetchData();
  };

  // getData = () => {
  //   let result = [];
  //   const data = this.props.newData;
  //   for (let i = 0; i < data.length; i++) {
  //     result.push({titlenaem: data.appname, AppID: data.id, publishTime: data.createtime, publishStatus: data.appstatus, publishTime: data.createtime});
  //   }
  //   return result;
  // };
  newRender = (value, index, record) => {
    return <a>操作</a>;
  };



  getIcon = (appicon) => {
    console.log(appicon);
    return (<img src={appicon} style={{
        width: '28px'
      }} className="media-side"/>)
  }
  Assess1 = (value,index, record) => {
    console.log(value,index,record);
    return (<Switch onChange={this.w1Change.bind(this,record.id)}  defaultChecked={value}/>)
  }
  w1Change=(e,id)=>{
    const that=this;
    ajaxTo('api.php?entry=sys&c=teacher1&a=group&do=wsign',{id:e,sign:1,username:that.props.user.admin})
    .then(function(res){
      Feedback.toast.success(res.message);
      console.log(res);
    })
    console.log(e);
    console.log(id);
  }
  Assess2 = (value,index, record) => {
    console.log(value,index,record);
    return (<Switch onChange={this.w2Change.bind(this,record.id)}  defaultChecked={value}/>)
  }
  w2Change=(e,id)=>{
    const that=this;
    ajaxTo('api.php?entry=sys&c=teacher1&a=group&do=wsign',{id:e,sign:2,username:that.props.user.admin})
    .then(function(res){
      Feedback.toast.success(res.message);
      console.log(res);
    })
    console.log(e,id);
  }
  Assess3 = (value,index, record) => {
    console.log(value,index,record);
    return (<Switch onChange={this.w3Change.bind(this,record.id)}  defaultChecked={value}/>)
  }
  w3Change=(e,id)=>{
    const that=this;
    console.log(e,id);
    ajaxTo('api.php?entry=sys&c=teacher1&a=group&do=wsign',{id:e,sign:3,username:that.props.user.admin})
    .then(function(res){
      Feedback.toast.success(res.message);
      console.log(res);
    })
  }
  Assess4 = (value,index, record) => {
    const that=this;
    console.log(value,index,record);
    return (<Switch onChange={this.w4Change.bind(this,record.id)}  defaultChecked={value}/>)
  }
  w4Change=(e,id)=>{
    const that=this;
    console.log(e,id);
    ajaxTo('api.php?entry=sys&c=teacher1&a=group&do=wsign',{id:e,sign:4,username:that.props.user.admin})
    .then(function(res){
      Feedback.toast.success(res.message);
      console.log(res);
    })
  }
  Assess5 = (value,index, record) => {
    console.log(value,index,record);
    return (<Switch onChange={this.w5Change.bind(this,record.id)}  defaultChecked={value}/>)
  }
  w5Change=(e,id)=>{
    const that=this;
    ajaxTo('api.php?entry=sys&c=teacher1&a=group&do=wsign',{id:e,sign:5,username:that.props.user.admin})
    .then(function(res){
      Feedback.toast.success(res.message);
      console.log(res);
    })
    console.log(e,id);
  }
  Assess6 = (value,index, record) => {
    console.log(value,index,record);
    return (<Switch onChange={this.w6Change.bind(this,record.id)}  defaultChecked={value}/>)
  }
  w6Change=(e,id)=>{
    const that=this;
    ajaxTo('api.php?entry=sys&c=teacher1&a=group&do=wsign',{id:e,sign:6,username:that.props.user.admin})
    .then(function(res){
      Feedback.toast.success(res.message);
      console.log(res);
    })
    console.log(e,id);
  }
  Assess7 = (value,index, record) => {
    console.log(value,index,record);
    return (<Switch onChange={this.w7Change.bind(this,record.id)}  defaultChecked={value}/>)
  }
  w7Change=(e,id)=>{
    const that=this;
    ajaxTo('api.php?entry=sys&c=teacher1&a=group&do=wsign',{id:e,sign:7,username:that.props.user.admin})
    .then(function(res){
      Feedback.toast.success(res.message);
      console.log(res);
    })
    console.log(e,id);
  }
  Assess8 = (value,index, record) => {
    console.log(value,index,record);
    return (<Switch onChange={this.w8Change.bind(this,record.id)}  defaultChecked={value}/>)
  }
  w8Change=(e,id)=>{
    const that=this;
    ajaxTo('api.php?entry=sys&c=teacher1&a=group&do=wsign',{id:e,sign:8,username:that.props.user.admin})
    .then(function(res){
      Feedback.toast.success(res.message);
      console.log(res);
    })
    console.log(e,id);
  }
  Assess9 = (value,index, record) => {
    console.log(value,index,record);
    return (<Switch onChange={this.w9Change.bind(this,record.id)}  defaultChecked={value}/>)
  }
  w9Change=(e,id)=>{
    const that=this;
    console.log(e,id);
    ajaxTo('api.php?entry=sys&c=teacher1&a=group&do=wsign',{id:e,sign:9,username:that.props.user.admin})
    .then(function(res){
      Feedback.toast.success(res.message);
      console.log(res);
    })
  }
  Assess10 = (value,index, record) => {
    console.log(value,index,record);
    return (<Switch onChange={this.w10Change.bind(this,record.id)}  defaultChecked={value}/>)
  }
  w10Change=(e,id)=>{
    const that=this;
    ajaxTo('api.php?entry=sys&c=teacher1&a=group&do=wsign',{id:e,sign:10,username:that.props.user.admin})
    .then(function(res){
      Feedback.toast.success(res.message);
      console.log(res);
    })
    console.log(e,id);
  }
  Assess11 = (value,index, record) => {
    console.log(value,index,record);
    return (<Switch onChange={this.w11Change.bind(this,record.id)}  defaultChecked={value}/>)
  }
  w11Change=(e,id)=>{
    const that=this;
    ajaxTo('api.php?entry=sys&c=teacher1&a=group&do=wsign',{id:e,sign:11,username:that.props.user.admin})
    .then(function(res){
      Feedback.toast.success(res.message);
      console.log(res);
    })
    console.log(e,id);
  }
  Assess12 = (value,index, record) => {

    console.log(value,index,record);
    return (<Switch onChange={this.w12Change.bind(this,record.id)}  defaultChecked={value}/>)
  }
  w12Change=(e,id)=>{
    const that=this;
    ajaxTo('api.php?entry=sys&c=teacher1&a=group&do=wsign',{id:e,sign:12,username:that.props.user.admin})
    .then(function(res){
      Feedback.toast.success(res.message);
      console.log(res);
    })
    console.log(e,id);
  }

  groupBtn=()=>{
    console.log(this.props);
    const that=this;
    console.log(this.state.allsel);

    ajaxTo('api.php?entry=sys&c=teacher1&a=group&do=adopts',{id:that.state.allsel,username:that.props.user.admin})
    .then(function(res){
      Feedback.toast.success(res.message);
      const result = ajaxTo('api.php?entry=sys&c=teacher1&a=group&do=student',{id:that.props.newData.history.params.id,username:that.props.user.admin});
      result.then(function(res) {
        console.log(res.data)

        that.setState({allData: res.data,pageNum:res.data.totle,currentPageNum:res.data.psize});
      })
      // that.props.history.router.push('transcationlist');
      // console.log(that.props);
    })

  }

  onSort(dataIndex, order) {
    let forData = this.state.allData;
  let dataSource = forData.sort(function(a, b) {
    let result = a[dataIndex] - b[dataIndex];
    return order === "asc" ? (result > 0 ? 1 : -1) : result > 0 ? -1 : 1;
  });
  this.setState({
    dataSource
  });
}

  render() {
    let forData = this.state.allData;
    console.log(forData);
    const arr = [];

    if (forData) {
      for (var i = 0; i < forData.length; i++) {
        arr.push({
          'username': forData[i].username,
          'phone': forData[i].phone,
          'work1': forData[i].work1,
          'work2': forData[i].work2,
          'work3': forData[i].work3,


          // 'status': forData[i].status == '1'
          //   ? '开启'
          //   : '关闭',
          'id':forData[i].id,
          'Worknumber': forData[i].Worknumber,
          'counter': forData[i].counter,
          'batch':forData[i].batch,
          'operation':forData[i].adopt,
          'delete':forData[i].delete,
          'W1':forData[i].wsign.w1==0?false:true,
          'W2':forData[i].wsign.w2==0?false:true,
          'W3':forData[i].wsign.w3==0?false:true,
          'W4':forData[i].wsign.w4==0?false:true,
          'W5':forData[i].wsign.w5==0?false:true,
          'W6':forData[i].wsign.w6==0?false:true,
          'W7':forData[i].wsign.w7==0?false:true,
          'W8':forData[i].wsign.w8==0?false:true,
          'W9':forData[i].wsign.w9==0?false:true,
          'W10':forData[i].wsign.w10==0?false:true,
          'W11':forData[i].wsign.w11==0?false:true,
          'W12':forData[i].wsign.w12==0?false:true,
        })
      }
    }
    console.log(arr);
    const tableData = {
      'currentPage': this.state.currentPage,
      'pageSize': this.state.currentPageNum,
      'data': arr,
      total:this.state.pageNum
    }

    const {tabList} = this.state;
    const allClassL=[
      {
        label:"不限",
        value:'1'
      },
      {
        label:"待审核",
        value:'2'
      },
      {
        label:"被禁用",
        value:'3'
      },
      {
        label:"正常",
        value:'4'
      },
    ]
    return (<div className="complex-tab-table">
      <IceContainer>
        <div>

        <IcePanel style={{
          marginTop: "25px"
        }}>
          <IcePanel.Header>
            小组学员列表
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
              <li>你确认是否删除该项</li>
              {/* <li>Negotiate the details of your order</li> */}
            </ul>
            </Dialog>


                        <Dialog
                        visible = {
                          this.state.visible1
                        }
                        onOk = {
                          this.deleteId1
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
                          <li>该学员是否已通过</li>
                          {/* <li>Negotiate the details of your order</li> */}
                        </ul>
                        </Dialog>



            <Table onSort={this.onSort.bind(this)}  dataSource={tableData.data} isLoading={tableData.__loading}  rowSelection={this.state.rowSelection}  className="basic-table" style={styles.basicTable} hasBorder={false} onRowClick={onRowClick}>
              <Table.Column title="编号" width={80} dataIndex="id"/>
              <Table.Column title="姓名" width={100} lock  dataIndex="username"/>
              <Table.Column title="手机号" width={100} dataIndex="phone"/>
              <Table.Column title="柜台" width={100} dataIndex="counter"/>
              <Table.Column title="期数" width={100} dataIndex="batch"/>
              <Table.Column title="工号" width={120} dataIndex="Worknumber"/>
              <Table.Column title="第一轮实战" width={80} dataIndex="work1" sortable/>
              <Table.Column title="第二轮实战" width={80} dataIndex="work2" sortable/>
              <Table.Column title="第三轮实战"  width={80} dataIndex="work3" sortable/>
              <Table.ColumnGroup title="状态" key="name-group" style={{'textAlign':'center'}}>
              <Table.Column title="学员状态" width={100} dataIndex="delete" cell={this.rendStatus} />
              <Table.Column title="W1" width={80} dataIndex="W1" cell={this.Assess1} sortable/>
              <Table.Column title="W2" width={80} dataIndex="W2" cell={this.Assess2} sortable/>
              <Table.Column title="W3" width={80} dataIndex="W3" cell={this.Assess3} sortable/>
              <Table.Column title="W4" width={80} dataIndex="W4" cell={this.Assess4} sortable/>
              <Table.Column title="W5" width={80} dataIndex="W5" cell={this.Assess5} sortable/>
              <Table.Column title="W6" width={80} dataIndex="W6" cell={this.Assess6} sortable/>
              <Table.Column title="W7" width={80} dataIndex="W7" cell={this.Assess7} sortable/>
              <Table.Column title="W8" width={80} dataIndex="W8" cell={this.Assess8} sortable/>
              <Table.Column title="W9" width={80} dataIndex="W9" cell={this.Assess9} sortable/>
              <Table.Column title="W10" width={80} dataIndex="W10" cell={this.Assess10} sortable/>
              <Table.Column title="W11" width={80} dataIndex="W11" cell={this.Assess11} sortable/>
              <Table.Column title="W12" width={80} dataIndex="W12" cell={this.Assess12} sortable/>
            </Table.ColumnGroup>

              <Table.Column title="进入STAGE2" dataIndex="operation" width={150} cell={this.renderOperations}/>
            </Table>
            <Button type="primary" onClick={this.groupBtn} style={{marginTop:"20px"}}>
              通过
            </Button>
          </IcePanel.Body>
        </IcePanel>
        </div>
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
