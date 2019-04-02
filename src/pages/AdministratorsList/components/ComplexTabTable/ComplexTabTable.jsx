/* eslint no-underscore-dangle:0 */
import React, {Component} from 'react';
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
import IceContainer from '@icedesign/container';
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
    tab: "",
    key: 0,
    content: "/administratorslist"
  },
  // {
  //   tab: "编辑管理员",
  //   key: 1,
  //   content: "/administrators/create"
  // }
];

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
    const result = ajaxTo('api.php?entry=sys&c=adminList&a=admin&do=adminList');
    result.then(function(res) {
      console.log(res.data)

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
    const id=this.state.currentid;

    this.setState({
      visible: false
    });
    console.log(id);
    ajaxTo('api.php?entry=sys&c=adminList&a=admin&do=delete', {'id': id}).then((res)=>{
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
    const toUrl = '/administrators/' + record.id;
    const toUrl1 = '/AddPower/' + record.id;
    return (<div style={styles.complexTabTableOperation}>
<Link  style={{marginLeft:"1rem"}} to={toUrl1}>角色分配</Link>

        <div style={aStyle} data-id={record.id} onClick={this.onOpen.bind(this,record.id)} >删除</div>
        <Link   style={{marginLeft:"1rem"}} to={toUrl}>密码修改</Link>
    </div>);
  };

  renderStatus = (value) => {
    return (<IceLabel inverse={false} status="default">
      {value}
    </IceLabel>);
  };

  changePage = (currentPage) => {
    this.queryCache.page = currentPage;
    const that=this;
    console.log(currentPage);
    ajaxTo('api.php?entry=sys&c=course&a=course&do=display',{page:currentPage})
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
          'title': forData[i].title,
          'name': forData[i].name,
          'status': forData[i].status == '1'
            ? '开启'
            : '关闭',
          'id':forData[i].id
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
        {/* <Tab>
          {tabs.map(item => (console.log(item), <TabPane key={item.key} tab={item.tab} onClick={this.tabClick}></TabPane>))}
        </Tab> */}
        <div>
          {/* <IcePanel>
          <IcePanel.Header>
            筛选
          </IcePanel.Header>
          <IcePanel.Body>
            <IceFormBinderWrapper ref={(formRef) => {
                this.formRef = formRef;
              }} value={this.state.value} onChange={this.onFormChange}>
              <div>
                <Row style={styles.formItem}>
                  <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                    标签：
                  </Col>
                  <Col s="12" l="10">
                    <IceFormBinder name="appclass">
                      <Select className="next-form-text-align"  dataSource={allClassL}/>
                    </IceFormBinder>
                  </Col>
                </Row>

                <Row style={styles.formItem}>
                  <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                    标题：
                  </Col>

                  <Col s="12" l="10">
                    <IceFormBinder name="appname" required={true} message="标题名称必须填写">
                      <Input style={{
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
        </IcePanel> */}

        <IcePanel style={{
          marginTop: "25px"
        }}>
          <IcePanel.Header>
            共计{this.state.allData?this.state.allData.length:null}条数据
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
              <Table.Column title="id" width={150} dataIndex="id"/>
              <Table.Column title="账号" width={150} dataIndex="name"/>
              {/* <Table.Column title="状态" dataIndex="status" width={85} cell={this.renderStatus}/> */}
              <Table.Column title="操作" dataIndex="operation" width={150} cell={this.renderOperations}/>
            </Table>
            <div style={styles.pagination}>
              {/* <Pagination current={tableData.currentPage} pageSize={tableData.pageSize} total={tableData.total} onChange={this.changePage}/> */}
            </div>
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
