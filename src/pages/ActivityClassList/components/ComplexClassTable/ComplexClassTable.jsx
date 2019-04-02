/* eslint no-underscore-dangle:0 */
import React, { Component } from 'react';
import { Table, Pagination, Tab, Search } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import IceImg from '@icedesign/img';
import DataBinder from '@icedesign/data-binder';
import IceLabel from '@icedesign/label';
import { enquireScreen } from 'enquire-js';
// import SubCategoryItem from './SubCategoryItem';
// import './ComplexTabTable.scss';
import { Link } from 'react-router'
import { ajaxTo } from '../../../../util/util';
import Img from '@icedesign/img';


const aStyle={
  display:"inline-block",
  color:"#5485F7",
  marginLeft:"1rem",
  cursor:'pointer'
}
const onRowClick = function(record, index, e) {
    console.log(record)

}

const TabPane = Tab.TabPane;
const tabs = [
  { tab: "分类列表", key: 0, content: "/activityClassList"},
  { tab: "分类编辑", key: 1, content: "/activityClass/createClass"},
];

export default class ComplexClassTable extends Component {
  static displayName = 'ComplexClassTable';

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.queryCache = {};
    this.state = {
      isMobile: false,
      currentTab: 'solved',
      currentCategory: '1',
    };
  }



  componentWillMount(){
    const that=this;
    const result = ajaxTo('api.php?entry=sys&c=app&a=appsort&do=display');
    result.then(function(res){
      console.log(res.data)

      that.setState({
        allData:res.data
      });
    })
  }
componentDidMount(){

}


  renderTitle = (value, index, record) => {
    return (
      <div style={styles.titleWrapper}>
        <div>
          <IceImg src={record.cover} width={48} height={48} />
        </div>
        <span style={styles.title}>{record.title}</span>
      </div>
    );
  };

  deleteId = (id) => {
    console.log(id);
    ajaxTo('api.php?entry=sys&c=app&a=appsort&do=del',{'sortid':id});
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
  editItem = (record, e) => {
    e.preventDefault();
    // TODO: record 为该行所对应的数据，可自定义操作行为
  };

  renderOperations = (value, index, record) => {
    console.log(record);
    const toUrl = '/activityClass/'+record.id;
    return (
      <div style={styles.complexTabTableOperation}>
        <Link to={toUrl}>编辑</Link>
        <div style={aStyle} data-id={record.id} onClick={this.deleteId.bind(this,record.id)}>删除</div>
      </div>
    );
  };

  renderStatus = (value) => {
    return (
      <IceLabel inverse={false} status="default">
        {value}
      </IceLabel>
    );
  };

  changePage = (currentPage) => {
    this.queryCache.page = currentPage;

  };

  tabClick = (key) => {
    const url = tabs[key].content;
    console.log(url);
    this.props.newData.history.router.push(url);
  }

  onSubCategoryClick = (catId) => {
    this.setState({
      currentCategory: catId,
    });
    this.queryCache.catId = catId;
    this.fetchData();
  };

  renderTabBarExtraContent = () => {
    return (
      <div style={styles.tabExtra}>
        <Search
          style={styles.search}
          type="secondary"
          placeholder="搜索"
          searchText=""
          onSearch={this.onSearch}
        />
      </div>
    );
  };

  getData = () => {
    let result = [];
    const data=this.props.newData;
    for (let i = 0; i < data.length; i++) {
      result.push({
        titlenaem: data.appname,
        AppID: data.id,
        publishTime: data.createtime,
        publishStatus:data.appstatus,
        publishTime:data.createtime

      });
    }
    return result;
  };
  newRender = (value, index, record) => {
    return <a>操作</a>;
  };

  getIcon = (appicon) => {
    console.log(appicon);
    return (
      <img src={appicon} style={{width:'28px'}} className="media-side" />
    )
  }

  render() {

    // let data=[];
    // for (var i = 0; i < this.props.newData.newData.length; i++) {
    //     console.log('1')
    // }
    console.log(this.props)
    console.log(this.state.allData);
    let forData=this.state.allData;
    const arr=[];
    if(forData){
      for (var i = 0; i < forData.length; i++) {

        arr.push({
          'id':forData[i].id,
          'sorttitle':forData[i].sorttitle,
          'publishTime':forData[i].createtime,
          'publishStatus':forData[i].sortstatus=='1'?'开启':'关闭',
          'appicon':forData[i].sorticon
        })
      }
    }
    const tableData = {
      'currentPage':1,
      'pageSize':8,
      'data':arr
    }

    const { tabList } = this.state;

    return (
      <div className="complex-tab-table">
        <IceContainer>
          <Tab onChange={this.tabChange}>
            {tabs.map(item => (
              <TabPane key={item.key} tab={item.tab} onClick={this.tabClick}>

              </TabPane>
            ))}
          </Tab>
          <Table
            dataSource={tableData.data}
            isLoading={tableData.__loading}
            className="basic-table"
            style={styles.basicTable}
            hasBorder={false}
            onRowClick={onRowClick}
          >
            <Table.Column
              title="标题"
              width={220}
              dataIndex="sorttitle"
            />
          <Table.Column
            title="icon"
            dataIndex="type"
            width={85}
            dataIndex="appicon"
            cell={this.getIcon}
          >

          </Table.Column>
            <Table.Column
              title="发布时间"
              dataIndex="publishTime"
              width={150}
            />
            <Table.Column
              title="状态"
              dataIndex="publishStatus"
              width={85}
              cell={this.renderStatus}
            />
            <Table.Column
              title="操作"
              dataIndex="operation"
              width={150}
              cell={this.renderOperations}
            />
          </Table>
          <div style={styles.pagination}>
            <Pagination
              current={tableData.currentPage}
              pageSize={tableData.pageSize}
              total={tableData.total}
              onChange={this.changePage}
            />
          </div>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  complexTabTableOperation: {
    lineHeight: '28px',
  },
  titleWrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  title: {
    marginLeft: '10px',
    lineHeight: '20px',
  },
  operation: {
    marginRight: '12px',
    textDecoration: 'none',
  },
  tabExtra: {
    display: 'flex',
    alignItems: 'center',
  },
  search: {
    marginLeft: 10,
  },
  tabCount: {
    marginLeft: '5px',
    color: '#3080FE',
  },
  pagination: {
    textAlign: 'right',
    paddingTop: '26px',
  },
};
