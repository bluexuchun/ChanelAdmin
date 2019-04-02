/* eslint no-underscore-dangle:0 */
import cookie from 'react-cookies';
import React, {Component} from 'react';
import {Table, Pagination, Tab, Search} from '@icedesign/base';
import {
  Input,
  Dialog,
  Button,
  Select,
  DatePicker,
  Grid,
  Icon,
  Tree,
  Feedback
} from '@icedesign/base';
import {connect} from 'react-redux';
import IceContainer from '@icedesign/container';
import IceImg from '@icedesign/img';
import DataBinder from '@icedesign/data-binder';
import IceLabel from '@icedesign/label';
import {enquireScreen} from 'enquire-js';
import './ComplexTabTable.scss';
import {Link} from 'react-router'
import {ajaxTo} from '../../../../util/util';
import Img from '@icedesign/img';
import IcePanel from '@icedesign/panel';
import {FormBinderWrapper as IceFormBinderWrapper, FormBinder as IceFormBinder, FormError as IceFormError} from '@icedesign/form-binder';
import './ComplexTabTable.scss'

const TreeNode = Tree.Node
const Toast = Feedback.toast
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
@connect(state=>({username:state.user}))
export default class CreateTranscationForm extends Component {
  static displayName = 'CreateTranscationForm';

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
      gname:'',
      visible: false,
      currentPage:1,
      isMobile: false,
      currentTab: 'solved',
      currentCategory: 1,
      allsel:[],
      value:{
        appclass:1
      },

    }
  }

  componentWillMount() {
    const that = this;
    const result = ajaxTo('api.php?entry=sys&c=teacher1&a=student&do=student',{username:that.props.username.admin});
    result.then(function(res) {
      if(res.status == 1){
        Toast.success(res.message);
        that.setState({allData: res.data});
      }else{
        Toast.error(res.message);
      }
    })
  }

  onChange(ids, records) {
    console.log(ids,records);
    let { rowSelection } = this.state;
    rowSelection.selectedRowKeys = ids;
    console.log("onChange", ids, records);
    this.setState({ allsel:ids });
  }

  tabClick = (key) => {
    const url = tabs[key].content;
    console.log(url);
    this.props.history.router.push(url);
  }

  renderTitle = (value, index, record) => {
    return (<div style={styles.titleWrapper}>
      <div>
        <IceImg src={record.cover} width={48} height={48}/>
      </div>
      <span style={styles.title}>{record.title}</span>
    </div>);
  };

  onFormChange = (value) => {
    this.setState({value:value});
  };

  editItem = (record, e) => {
    e.preventDefault();
  };


  renderStatus = (value) => {
    return (<IceLabel inverse={false} status="default">
      {value}
    </IceLabel>);
  };

  changePage = (currentPage) => {
    this.queryCache.page = currentPage;
    const that=this;
    ajaxTo('api.php?entry=sys&c=stage&a=stage&do=list',{page:currentPage,username:that.props.username.admin})
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

  submit=()=>{
    const that=this;
    console.log(this.state.value);
    ajaxTo('api.php?entry=sys&c=teacher1&a=student&do=student',{keyword:this.state.value.appname,username:that.props.username.admin})
    .then(function(res){
      if(res.status == 1){

      }
      that.setState({
        allData:res.data
      })
    })
  }

  onOpen = (id) => {
    this.setState({
      visible: true,
      currentid:id,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  GroupChange=(value)=>{
    console.log(value);
    this.setState({
      gname:value
    })
  }
  groupBtn=()=>{
    const userInfo=cookie.load('userInfo');
    const that=this;
    const url=this.props.history.params.id=='create'?'api.php?entry=sys&c=teacher1&a=student&do=addgroup':'api.php?entry=sys&c=teacher1&a=student&do=member';
    ajaxTo(url,{id:that.state.newkeys,groupid:this.props.history.params.id,username:userInfo.admin,gname:that.state.gname})
    .then(function(res){
      Feedback.toast.success(res.message);
      setTimeout(() => {
        that.props.history.router.push('transcationlist');
      },1000)
      
    })
  }

  /**
   * 选择
   */
  onCheck = (keys, info) => {
    let that = this
    let newkeys = []
    keys.map((v,i) => {
      if(!v.includes('-')){
        newkeys.push(v)
      }
    })
    that.setState({
      newkeys
    })
  }

  render() {

    const tableData = {
      'currentPage': this.state.currentPage,
      'pageSize': this.state.currentPageNum,
      'total':this.state.pageNum
    }

    const {tabList,allData} = this.state;

    return (<div className="complex-tab-table">
      <Dialog
          visible = {this.state.visible}
          onOk = {this.groupBtn}
          closable = "esc,mask,close"
          onCancel = {this.onClose}
          onClose = {this.onClose}
          title = "提示框" > <h3></h3>
          <Row style={styles.formItem}>
            <Col xxs="24" s="8" l="8" style={styles.formLabel}>
              分组名称：
            </Col>
            <Col s="20" l="16">
                <Input placeholder="" onChange={this.GroupChange} style={{
                    width: '100%'
                  }}/>
            </Col>
          </Row>
      </Dialog>

      <IceContainer>
        <Tab defaultActiveKey={1}>
          {tabs.map(item => (console.log(item), <TabPane key={item.key} tab={item.tab} onClick={this.tabClick}></TabPane>))}
        </Tab>
        <IcePanel>
          <IcePanel.Header>
            共计{tableData.total}条数据
          </IcePanel.Header>
          <IcePanel.Body>
            <div style={{width:'100%',borderBottom:'1px solid #eaeaea'}}>
              <Row style={{flex:1,marginLeft:'60px',padding:'15px 0px'}}>
                <Col span="4">学员姓名</Col>
                <Col span="4">手机号</Col>
                <Col span="4">期数</Col>
                <Col span="4">入职时间</Col>
                <Col span="4">工号</Col>
                <Col span="4">柜台</Col>
              </Row>
            </div>
            
            <Tree checkable editable
              onSelect={this.onSelect}
              onCheck={this.onCheck}
              style={{width:'100%'}}
              >
                {allData ? 
                  allData.map((v,i) => (
                    <TreeNode label={v.group.gname} style={{borderBottom:'1px solid #eaeaea',padding:'10px 0px'}} >
                      {v.member ? 
                        v.member.map((k,j) => (
                          <TreeNode 
                          style={{flex:1,display:'flex',flexDirection:'row'}}
                          label={
                            <Row style={{flex:1}}>
                              <Col span="4">{k.username}</Col>
                              <Col span="4">{k.phone}</Col>
                              <Col span="4">{k.batch}</Col>
                              <Col span="4">{k.date}</Col>
                              <Col span="4">{k.Worknumber}</Col>
                              <Col span="4">{k.counter}</Col>
                            </Row>
                          } 
                          key={k.id}>
                          </TreeNode>
                        )) : null
                      }
                    </TreeNode>
                  )) : null
                }
            </Tree>
            <Button type="primary" onClick={this.props.history.params.id=="create"?this.onOpen.bind(this):this.groupBtn.bind(this)} style={{marginTop:"20px"}}>
              {this.props.history.params.id=="create"?"分组":"添加小组成员"}
            </Button>
          </IcePanel.Body>
        </IcePanel>
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
