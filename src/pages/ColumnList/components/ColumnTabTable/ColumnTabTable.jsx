/* eslint no-underscore-dangle:0 */
import React, { Component } from 'react';
import { Table, Pagination, Tab, Search ,Dialog} from '@icedesign/base';
import IceContainer from '@icedesign/container';
import IceImg from '@icedesign/img';
import DataBinder from '@icedesign/data-binder';
import IceLabel from '@icedesign/label';
import {Feedback} from '@icedesign/base';
import { enquireScreen } from 'enquire-js';
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
export default class ColumnTabTable extends Component {
  static displayName = 'ColumnTabTable';

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.queryCache = {};
    this.state = {
      isMobile: false,
      currentTab: 'solved',
      currentCategory: '1',
      visible: false,
    };
  }



  componentWillMount(){
    const that=this;
    const result = ajaxTo('api.php?entry=sys&c=step&a=step&do=list');
    result.then(function(res){
      if(res.data){
        console.log(res.data)
that.setState({allData: res.data.data,pageNum:res.data.total,currentPageNum:res.data.psize});
        // that.setState({
        //   allData:res.data.data
        // });
      }
    })
  }
componentDidMount(){
  const that=this;

  setTimeout(()=>{
      const data=that.state.allData;
    // console.log(data[0])
  },1000)
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
      ajaxTo('api.php?entry=sys&c=step&a=step&do=del', {'id': id}).then((res)=>{
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
    console.log(this.state.allData)
    console.log(index)
    const columnClassUrl=this.state.allData;
    console.log(record)
    const toUrl = '/column/'+(-record.id);
    const columnUrl='/columnclass/'+columnClassUrl[index].type+`/${record.id}`
    return (
      <div style={styles.complexTabTableOperation}>
        <Link to={toUrl}>编辑</Link>
        <div style={aStyle} data-id={record.id} onClick={this.onOpen.bind(this,record.id)} >删除</div>
        <Link style={aStyle} to={columnUrl}>步骤内容编辑</Link>
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
  //       titlenaem: data.appname,
  //       AppID: data.id,
  //       publishTime: data.createtime,
  //       publishStatus:data.appstatus,
  //       publishTime:data.createtime
  //
  //     });
  //   }
  //   return result;
  // };
  // newRender = (value, index, record) => {
  //   return <a>操作</a>;
  // };

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
  var  title="";
    console.log(this.props)
    console.log(this.state.allData);
    let forData=this.state.allData;
    const arr=[];
    if(forData){
      for (var i = 0; i < forData.length; i++) {
        if(forData[i].type=="0"){
          title="体验产品";
        }else if(forData[i].type=="1"){
          title="浏览产品网页";
        }else if(forData[i].type=="2"){
          title="观看产品视频";
        }else if(forData[i].type=="3"){
          title="小测试";
        }

        arr.push({
          'daytitle':forData[i].daytitle,
          'title':forData[i].title,
          'publishTime':forData[i].createtime,
          'id':forData[i].id,
          'status':forData[i].status=='1'?'开启':'关闭',
          'type':title,
          'typename':forData[i].typename,
          'icon':forData[i].icon,
          'icons':forData[i].icons
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
              title="所属主题"
              width={120}
              dataIndex="daytitle"
            />
            <Table.Column
              title="步骤名称"
              width={120}
              dataIndex="title"
            />
            <Table.Column
              title="步骤类型"
              width={120}
              dataIndex="type"
            />

            {/* <Table.Column
              title="完成后icon"
              dataIndex="icons"
              width={85}
              cell={this.getIcon}
            /> */}

          {/* </Table.Column>
            <Table.Column
              title="发布时间"
              dataIndex="publishTime"
              width={150}
            /> */}
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
