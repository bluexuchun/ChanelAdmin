/* eslint no-underscore-dangle:0 */
import React, {Component} from 'react';
import cookie from 'react-cookies';
import {Table, Pagination, Tab, Search} from '@icedesign/base';
import {
  Dialog,
  Input,
  Button,
  Select,
  DatePicker,
  Grid,
  Icon
} from '@icedesign/base';
import {connect} from 'react-redux';
import IceContainer from '@icedesign/container';
import IceImg from '@icedesign/img';
import DataBinder from '@icedesign/data-binder';
import IceLabel from '@icedesign/label';
import {enquireScreen} from 'enquire-js';
import SubCategoryItem from './SubCategoryItem';
import './ComplexTabTable.scss';
import {Link} from 'react-router'
import {ajaxTo,baseURL} from '../../../../util/util';
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
    tab: "分组列表",
    key: 0,
    content: "/transcationlist"
  }, {
    tab: "用户添加",
    key: 1,
    content: "/transcation/create"
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
      currentPage:1,
      isMobile: false,
      currentTab: 'solved',
      currentCategory: 1,
      visible: false,

    };
  }

  componentWillMount() {
    const that = this;
      const userInfo=cookie.load('userInfo');
      console.log(this.props);
    const result = ajaxTo('api.php?entry=sys&c=teacher1&a=student&do=groupList',{username:userInfo.admin});
    result.then(function(res) {
      console.log(res.data)

      // that.setState({allData: res.data.data,pageNum:res.data.totle,currentPageNum:res.data.psize});
        that.setState({allData: res.data});
    })
  }
  //
  // componentDidMount() {}

  //弹窗
  onOpen = (id) => {
    console.log(id);
  this.setState({
    visible: true,
    currentid:id,
  });
};

onClose = () => {
  console.log('!!!');
  this.setState({
    visible: false,
    visible1:false
  });
};

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

  deleteId = () => {
    const that=this;
    const id=this.state.currentid;

    this.setState({
      visible: false
    });
    console.log(id);
    ajaxTo('api.php?entry=sys&c=teacher1&a=student&do=del', {'id': id,username:that.props.user.admin}).then((res)=>{
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


  editItem = (record, e) => {
    e.preventDefault();
    // TODO: record 为该行所对应的数据，可自定义操作行为
  };

  renderOperations = (value, index, record) => {
    const toUrl = '/groupchecklist1/' + record.id;
    const toUrl1='/StatusChange/'+record.id;
    const toUrl2='/transcation/'+record.id;
    const toCode='testcode/'+record.id;
    const datapic='datapic1/'+record.id;

    const exportUrl = baseURL + 'api.php?entry=sys&c=group&a=export&do=export_stage2&group_id='+record.id

    return (<div style={styles.complexTabTableOperation}>
      <Link to={toUrl}>查看学员</Link>
      <Link style={aStyle} to={toCode}>二维码</Link>
      <Link style={aStyle} to={toUrl1}>状态及名称编辑</Link>
      <Link style={aStyle} to={toUrl2}>添加学员</Link>

      <div style={aStyle} data-id={record.id} onClick={this.onOpen.bind(this,record.id)} >解散</div>
      <a style={aStyle} href={exportUrl}>导出学员信息</a>
      <Link style={aStyle} to={toUrl1}>成绩查看</Link>
    </div>);
  };
// <Link style={aStyle} to={datapic}>每日测试统计</Link>
  renderStatus = (value) => {
    return (<IceLabel inverse={false} status="default">
      {value}
    </IceLabel>);
  };

  changePage = (currentPage) => {

    this.queryCache.page = currentPage;
    const that=this;
    console.log(currentPage);
    ajaxTo('api.php?entry=sys&c=stage&a=stage&do=list',{page:currentPage})
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

  newRender = (value, index, record) => {
    return <a>操作</a>;
  };

  getIcon = (appicon) => {
    console.log(appicon);
    return (<img src={appicon} style={{
        width: '28px'
      }} className="media-side"/>)
  }

  render() {
    let forData = this.state.allData;
    console.log(forData);
    const arr = [];

    if (forData) {
      for (var i = 0; i < forData.length; i++) {
        arr.push({
          'gname':forData[i].gname,
          'id': forData[i].id,
          'teacher':forData[i].teacher,
          'createtime': forData[i].createtime,
          'explain': forData[i].explain,
          'stage': forData[i].stage,
          'status': forData[i].status == '0'
            ? '未开启'
            : forData[i].status == '1'?'培训中':'已完成',
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
        <Tab>
          {tabs.map(item => (console.log(item), <TabPane key={item.key} tab={item.tab} onClick={this.tabClick}></TabPane>))}
        </Tab>
        <div>
        <IcePanel style={{
          marginTop: "25px"
        }}>
          <IcePanel.Header>
            实战期
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
            <Table dataSource={tableData.data} isLoading={tableData.__loading} className="basic-table" style={styles.basicTable} hasBorder={false} onRowClick={onRowClick}>
              <Table.Column title="分组名称" width={100} dataIndex="gname"/>
              <Table.Column title="小组老师" width={100} dataIndex="teacher"/>
              <Table.Column title="所属阶段" width={100} dataIndex="stage"/>
              <Table.Column title="创建日期" width={100} dataIndex="createtime"/>

              <Table.Column title="当前状态" dataIndex="status" width={85} cell={this.renderStatus}/>
              <Table.Column title="操作" dataIndex="operation" width={250} cell={this.renderOperations}/>
            </Table>
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
