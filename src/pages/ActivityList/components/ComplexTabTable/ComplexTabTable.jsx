/* eslint no-underscore-dangle:0 */
import React, { Component } from 'react';
import { Table, Pagination, Tab, Search,Dialog } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import IceImg from '@icedesign/img';
import DataBinder from '@icedesign/data-binder';
import IceLabel from '@icedesign/label';
import {Feedback} from '@icedesign/base';
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
      visible: false,
      currentPage:1,
    };
  }



  componentWillMount(){
    const that=this;
    const result = ajaxTo('api.php?entry=sys&c=schedule&a=schedule&do=list');
    result.then(function(res){
      console.log(res)
      if(res.status == 1){
      that.setState({allData: res.data.data,pageNum:res.data.total,currentPageNum:res.data.psize});
      }


      //console.log(that.state);
    })
  }

  componentDidMount(){

  }


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

  deleteId = () => {
    const id=this.state.currentid;

    this.setState({
      visible: false
    });
    console.log(id);
    ajaxTo('api.php?entry=sys&c=schedule&a=schedule&do=del', {'id': id}).then((res)=>{
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
    var  toCUrl
    if(record.id!=19){

      toCUrl='/column/'+record.id;
    }else{
      toCUrl='columnclass/3/'+(-record.id);
    }
    const toUrl = '/activity/'+record.id;
    return (
      <div style={styles.complexTabTableOperation}>
        <Link to={toUrl}>编辑</Link>
        <div style={aStyle} data-id={record.id} onClick={this.onOpen.bind(this,record.id)} >删除</div>
        <Link style={aStyle} to={toCUrl}>{record.id==19?"阶段测试":"步骤添加"}</Link>
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
    ajaxTo('api.php?entry=sys&c=schedule&a=schedule&do=list',{page:currentPage})
    .then(function(res){
      console.log(res)
      that.setState({
        currentPage:currentPage,
        allData:res.data.data

      })
    })

  };

  onTabChange = (tabKey) => {
    const firstTabCatId = this.state.tabList.find((item) => {
      return item.type === tabKey;
    }).subCategories[0].id;

    this.setState({
      currentTab: tabKey,
      currentCategory: firstTabCatId,
    });
    this.queryCache.catId = firstTabCatId;
    this.fetchData();
  };

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

  // getData = () => {
  //   let result = [];
  //   const data=this.props.newData;
  //   for (let i = 0; i < data.length; i++) {
  //     result.push({
  //       titlenaem: data.activityname,
  //       AppID: data.id,
  //       publishTime: data.createtime,
  //       publishStatus:data.appstatus,
  //       publishTime:data.createtime
  //
  //     });
  //   }
  //   return result;
  // };
  newRender = (value, index, record) => {
    return <a>操作</a>;
  };

  getIcon = (activityicon) => {
    console.log(activityicon);
    return (
      <img src={activityicon} style={{width:'28px'}} className="media-side" />
    )
  }

  render() {

    let forData = this.state.allData;
    console.log(this.state.allData);
    console.log(forData);
    const arr=[];
    if(forData != undefined){
      for (var i = 0; i < forData.length; i++) {
        console.log(i);
        arr.push({
          'id':forData[i].id,
          'daytitle':forData[i].daytitle,
          'abstract':forData[i].abstract,
          'banner':forData[i].banner,
          'stageTitle':forData[i].stageTitle,
          'displayorder':forData[i].displayorder,
          // 'status':forData[i].status==1?'true':'false'
          //
          'status': forData[i].status == '1'
            ? '开启'
            : '关闭',
        })
      }
    }
    const tableData = {
      'currentPage': this.state.currentPage,
      'pageSize': this.state.currentPageNum,
      'data': arr,
      total:this.state.pageNum
    }
console.log(arr);
    const { tabList } = this.state;

    return (
      <div className="complex-tab-table">
        <IceContainer>

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
          <Table
            dataSource={tableData.data}
            isLoading={tableData.__loading}
            className="basic-table"
            style={styles.basicTable}
            hasBorder={false}
            onRowClick={onRowClick}
          >
            <Table.Column
              title="主题名称"
              width={120}
              dataIndex="daytitle"
            />
            <Table.Column
              title="缩略图"
              dataIndex="banner"
              width={85}
              cell={this.getIcon}
            >
            </Table.Column>

            <Table.Column
             title="学习概要"
             width={140}
             dataIndex="abstract"
           />
            <Table.Column
              title="所属阶段"
              width={120}
              dataIndex="stageTitle"
            />
            <Table.Column
              title="排序"
              width={100}
              dataIndex="displayorder"
            />
            <Table.Column
              title="状态"
              width={120}
              dataIndex="status"
              cell={this.renderStatus}
            />




          {/* <Table.Column
            title="完成后的icon"
            dataIndex="type"
            width={85}
            dataIndex="activityicon1"
            cell={this.getIcon}
          >
          </Table.Column> */}


            <Table.Column
              title="操作"
              dataIndex="operation"
              width={150}
              cell={this.renderOperations}
            />
          </Table>
          <div style={styles.pagination}>
              <Pagination current={tableData.currentPage} pageSize={tableData.pageSize} total={tableData.total} onChange={this.changePage}/>
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
