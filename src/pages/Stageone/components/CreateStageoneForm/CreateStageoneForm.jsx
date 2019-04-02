/* eslint no-underscore-dangle:0 */
import React, {Component} from 'react';
import {Table, Pagination, Tab, Search} from '@icedesign/base';
import {
  Input,
  Button,
  Select,
  DatePicker,
  Dialog,
  Grid,
  Icon
} from '@icedesign/base';
import IceContainer from '@icedesign/container';
import cookie from 'react-cookies';
import IceImg from '@icedesign/img';
import DataBinder from '@icedesign/data-binder';
import {connect} from 'react-redux';
import IceLabel from '@icedesign/label';
import {enquireScreen} from 'enquire-js';
// import SubCategoryItem from './SubCategoryItem';
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
    tab: "分组列表",
    key: 0,
    content: "/stageonelist"
  }, {
    tab: "用户添加",
    key: 1,
    content: "/stageone/create"
  }
];

@connect(state=>({user:state.user}))
export default class CreateStageoneForm extends Component {
  static displayName = 'CreateStageoneForm';

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
      gname:'',
      visible: false,
      currentCategory: 1,
      allsel:[],

      value:{
        appclass:1
      },

    }
  }

  componentWillMount() {
    console.log(this.props);
    const that = this;
    const result = ajaxTo('api.php?entry=sys&c=teacher&a=student&do=student',{username:this.props.user.admin});
    result.then(function(res) {
      console.log(res.data)

      that.setState({allData: res.data});
    })
  }
  //
  // componentDidMount() {}

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
  });
};
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
    console.log(value);
    this.setState({value:value});
    // console.log(this.state.value.appname);
  };

  deleteId = (id) => {
    console.log(id);
    ajaxTo('api.php?entry=sys&c=stage&a=stage&do=del', {'id': id,username:this.props.user.admin}).then((res)=>{
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

  }
  editItem = (record, e) => {
    e.preventDefault();
    // TODO: record 为该行所对应的数据，可自定义操作行为
  };

  renderOperations = (value, index, record) => {
    const toUrl = '/topicmanage/' + record.id;
    return (<div style={styles.complexTabTableOperation}>
      <Link to={toUrl}>编辑</Link>
      <div style={aStyle} data-id={record.id} onClick={this.deleteId.bind(this, record.id)}>删除</div>
    </div>);
  };

  renderStatus = (value) => {
    return (<IceLabel inverse={false} status="default">
      {value}
    </IceLabel>);
  };

  qishuChange=(value,option)=>{
    const that=this;
    console.log(value,option);
    ajaxTo('api.php?entry=sys&c=teacher&a=student&do=student',{sort:value,username:this.props.user.admin})
    .then(function(res){
      console.log(res);
      that.setState({
        allData:res.data
      })
    })

  }

  changePage = (currentPage) => {

    this.queryCache.page = currentPage;
    const that=this;
    console.log(currentPage);
    ajaxTo('api.php?entry=sys&c=stage&a=stage&do=list',{page:currentPage,username:this.props.user.admin})
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
  ajaxTo('api.php?entry=sys&c=teacher&a=student&do=student',{keyword:this.state.value.appname,username:this.props.user.admin})
  .then(function(res){
    console.log(res);
    that.setState({
      allData:res.data
    })
  })
}
GroupChange=(value)=>{
  console.log(value);
  this.setState({
    gname:value
  })
}
groupBtn=()=>{


  const userInfo=cookie.load('userInfo');
  const that=this;
  console.log(this.state.allsel);
  const url=this.props.history.params.id=='create'?'api.php?entry=sys&c=teacher&a=student&do=addgroup':'api.php?entry=sys&c=teacher&a=student&do=member';
  ajaxTo(url,{id:that.state.allsel,groupid:this.props.history.params.id,username:userInfo.admin,gname:that.state.gname})
  .then(function(res){
    Feedback.toast.success(res.message);
    console.log(res);
    that.props.history.router.push('stageonelist');
    // console.log(that.props);
  })

}
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

  render() {
    let forData = this.state.allData;
    console.log(forData);
    const arr = [];

    if (forData) {
      for (var i = 0; i < forData.length; i++) {
        arr.push({
          'username': forData[i].username,
          'phone': forData[i].phone,
          'date': forData[i].date,
          // 'status': forData[i].status == '1'
          //   ? '开启'
          //   : '关闭',
          'id':forData[i].id,
          'Worknumber': forData[i].Worknumber,
          'counter': forData[i].counter,
          'batch':forData[i].batch,
        })
      }
    }
    // if (forData) {
    //   for (var i = 0; i < forData.length; i++) {
    //
    //     arr.push({
    //       'title': forData[i].title,
    //       'tag': forData[i].tag,
    //       'publishTime': forData[i].create_time,
    //       'id': forData[i].id,
    //       'status': forData[i].status,
    //       'appicon': forData[i].cover
    //     })
    //   }
    // }
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

    ]
    return (<div className="complex-tab-table">
      <IceContainer>
        <Tab defaultActiveKey={1}>
          {tabs.map(item => (console.log(item), <TabPane key={item.key} tab={item.tab} onClick={this.tabClick}></TabPane>))}
        </Tab>
        <div>
          <IcePanel>
          <IcePanel.Header>
            筛选
          </IcePanel.Header>
          <IcePanel.Body>

            <IceFormBinderWrapper ref={(formRef) => {
                this.formRef = formRef;
              }} value={this.state.value} onChange={this.onFormChange}>
              <div>

              <Dialog
              visible = {
                this.state.visible
              }
              onOk = {
                this.groupBtn
              }
              closable = "esc,mask,close"
              onCancel = {
                this.onClose
              }
              onClose = {
                this.onClose
              }
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

                <Row style={styles.formItem}>
                  <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                    期数筛选：
                  </Col>
                  <Col s="12" l="10">
                    <IceFormBinder name="appclass">
                      <Select className="next-form-text-align" defaultValue={this.state.value.appclass}  dataSource={allClassL} onChange={this.qishuChange}/>
                    </IceFormBinder>
                  </Col>
                </Row>

                {/* <Row style={styles.formItem}>
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
                </Row> */}


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

              <Row style={styles.formItem}>
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
            <Table dataSource={tableData.data} isLoading={tableData.__loading} className="basic-table" rowSelection={this.state.rowSelection} style={styles.basicTable} hasBorder={false} onRowClick={onRowClick}>
              <Table.Column title="学员姓名" width={150} dataIndex="username"/>
              <Table.Column title="手机号" width={150} dataIndex="phone"/>
              <Table.Column title="期数" width={150} dataIndex="batch"/>
              <Table.Column title="入职时间" width={150} dataIndex="date"/>
              <Table.Column title="工号" width={150} dataIndex="Worknumber"/>
              <Table.Column title="柜台" width={150} dataIndex="counter"/>
              {/* <Table.Column title="状态" dataIndex="status" width={85} cell={this.renderStatus}/> */}
              {/* <Table.Column title="操作" dataIndex="operation" width={150} cell={this.renderOperations}/> */}
            </Table>
            <Button type="primary" onClick={this.props.history.params.id=="create"?this.onOpen.bind(this):this.groupBtn.bind(this)} style={{marginTop:"20px"}}>
              {this.props.history.params.id=="create"?"分组":"添加小组成员"}
            </Button>
            {/* <div style={styles.pagination}>
              <Pagination current={tableData.currentPage} pageSize={tableData.pageSize} total={tableData.total} onChange={this.changePage}/>
            </div> */}
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
