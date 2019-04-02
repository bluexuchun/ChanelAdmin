/* eslint no-underscore-dangle:0 */
import React, { Component } from 'react';
import { Table, Pagination, Tab, Search } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import IceImg from '@icedesign/img';
import DataBinder from '@icedesign/data-binder';
import IceLabel from '@icedesign/label';
import { enquireScreen } from 'enquire-js';
import SubCategoryItem from './SubCategoryItem';
import './ComplexTabTable.scss';
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
  { tab: "体验产品列表", key: 0, content:`/columnclass/0/`},
  { tab: "添加体验产品", key: 1, content: "/columnclass/0/"},
];

export default class ComplexTabTable extends Component {
  static displayName = 'ComplexTabTable';

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
    console.log(this.props);
    console.log(this.props.newData.history.params.id);
    const that=this;
    const result = ajaxTo('api.php?entry=sys&c=applicable&a=applicable&do=list',{sid:this.props.newData.history.params.id});
    result.then(function(res){
      if(res.data){
        console.log(res)
        that.setState({allData: res.data.data,pageNum:res.data.totle,currentPageNum:res.data.psize})
      }


// that.setState({allData: res.data.data,pageNum:res.totle,currentPageNum:res.psize});

    })
  }

  componentDidMount(){
    console.log(this.props);
  }

  tabClick = (key) => {
    console.log(key);
    if(key==0){
      const sid=this.props.newData.history.params.id;
      const url = tabs[key].content;
      console.log(url);
      this.props.newData.history.router.push(url+sid);
    }else{
      const sid=this.props.newData.history.params.id;
      const url = tabs[key].content;
      console.log(url);
      this.props.newData.history.router.push(url+sid+"/create");
    }

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
    ajaxTo('api.php?entry=sys&c=applicable&a=applicable&do=del',{'id':id});
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
    const toUrl = '/columnclass/0/'+this.props.newData.history.params.id+'/'+record.id;
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
    this.setState({
      currentCategory: catId,
    });
    this.queryCache.catId = catId;
    this.fetchData();
  };

  getData = () => {
    let result = [];
    const data=this.props.newData;
    for (let i = 0; i < data.length; i++) {
      result.push({
        name: data.nickname,
        chat: data.cid,
        status:data.status,

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

    let forData=this.state.allData;
    const arr=[];
    if(forData){
      for (var i = 0; i < forData.length; i++) {

        arr.push({
          'title': forData[i].title,
          'banner': forData[i].banner,
          'setptitle':forData[i].setptitle,
          'status':forData[i].status=='1'?'显示':'隐藏',
          'id':forData[i].id
        })
      }
    }
    const tableData = {
      'currentPage': this.state.currentPage,
      'pageSize': this.state.currentPageNum,
      'data': arr,
      total:this.state.pageNum
    }

    const { tabList } = this.state;

    return (
      <div className="complex-tab-table">
        <IceContainer>
          <Tab>
            {tabs.map(item => (
              console.log(item),
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
              title="产品名称"
              width={220}
              dataIndex="title"
            />
            <Table.Column
              title="banner"
              width={100}
              dataIndex="banner"
              cell={this.getIcon}
            />


            <Table.Column
              title="所属主题"
              width={220}
              dataIndex="setptitle"
            />


            <Table.Column
              title="状态"
              dataIndex="status"
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
