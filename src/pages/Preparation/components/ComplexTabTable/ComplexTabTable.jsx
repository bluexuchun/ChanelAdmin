/* eslint no-underscore-dangle:0 */
import React, {Component} from 'react';
import {Table, Pagination, Tab, Search} from '@icedesign/base';
import {connect} from 'react-redux';
import {
  Input,
  Dialog,
  Button,
  Select,
  DatePicker,
  Switch,
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
      currentPage:1,
      isMobile: false,
      currentTab: 'solved',
      currentCategory: 1,
      visible: false,
      visible1: false

    };
  }

  componentWillMount() {
    console.log(this.props.user.admin);
    const that = this;
    const result = ajaxTo('api.php?entry=sys&c=group&a=daystatus&do=student',{id:this.props.newData.history.params.id,username:this.props.user.admin});
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





  editItem = (record, e) => {
    e.preventDefault();
    // TODO: record 为该行所对应的数据，可自定义操作行为
  };


  renderOperations = (value, index, record) => {
    const toUrl = '/topicmanage/' + record.id;
    return (<div style={styles.complexTabTableOperation}>

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
          'day1': forData[i].day1,
          'day2': forData[i].day2,
          'day3': forData[i].day3,
          'day4': forData[i].day4,
          'stage':forData[i].stage,
          'sign':forData[i].sign=="true"?true:false,
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
        label:"签到/升序",
        value:'0'
      },
      {
        label:"签到/降序",
        value:'1'
      },

    ]
    return (<div className="complex-tab-table">
      <IceContainer>
        {/* <Tab>
          {tabs.map(item => (console.log(item), <TabPane key={item.key} tab={item.tab} onClick={this.tabClick}></TabPane>))}
        </Tab> */}
        <div>


        <IcePanel style={{
          marginTop: "25px"
        }}>
          <IcePanel.Header>
            小组学员预习列表
          </IcePanel.Header>
          <IcePanel.Body>
            <Table onSort={this.onSort.bind(this)} dataSource={tableData.data} isLoading={tableData.__loading} className="basic-table" style={styles.basicTable} hasBorder={false} onRowClick={onRowClick}>
              <Table.Column title="编号" width={80} lock dataIndex="id"/>
              <Table.Column title="姓名" width={100} lock dataIndex="username"/>
              <Table.Column title="手机号" width={100}  dataIndex="phone"/>
              <Table.Column title="第一天" width={80} dataIndex="day1" sortable />
              <Table.Column title="第二天" width={80} dataIndex="day2" sortable/>
              <Table.Column title="第三天" width={80} dataIndex="day3" sortable/>
              <Table.Column title="第四天" width={80} dataIndex="day4" sortable/>

            </Table>
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
