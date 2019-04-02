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
    console.log(this.props.newData.history.params.id);
    const that = this;
    const result = ajaxTo('api.php?entry=sys&c=group&a=record&do=allgourp',{sid:this.props.newData.history.params.id});
    result.then(function(res) {
      console.log(res)

      that.setState({allData: res.data});
    })
  }
  //
  // componentDidMount() {}





  renderTitle = (value, index, record) => {
    return (<div style={styles.titleWrapper}>
      <div>
        <IceImg src={record.cover} width={48} height={48}/>
      </div>
      <span style={styles.title}>{record.title}</span>
    </div>);
  };




  editItem = (record, e) => {
    e.preventDefault();
    // TODO: record 为该行所对应的数据，可自定义操作行为
  };

  renderOperations = (value, index, record) => {
    const that=this;
    const toUrl1 = 'wrong/'+(record.id);
    const path={pathname:'wrong/'+(that.props.newData.history.params.id),query:{gid:record.id}}
    return (<div style={styles.complexTabTableOperation}>
<Link  style={{marginLeft:"1rem"}} to={path}>小组错题记录</Link>
    </div>);
  };

  renderStatus = (value) => {
    return (<IceLabel inverse={false} status="default">
      {value}
    </IceLabel>);
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
          'gid': forData[i].gid,
          'gname': forData[i].gname,
          'id':forData[i].gid
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

    return (<div className="complex-tab-table">
      <IceContainer>

        <div>
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
              <Table.Column title="gid" width={150} dataIndex="gid"/>
              <Table.Column title="小组名称" width={150} dataIndex="gname"/>
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
