/* eslint no-underscore-dangle:0 */
import React, { Component } from 'react';
import { Table, Pagination, Tab, Search ,Button,Grid,Card,Input,Select } from '@icedesign/base';
import IceContainer from '@icedesign/container';
import IcePanel from '@icedesign/panel';
import IceImg from '@icedesign/img';
import DataBinder from '@icedesign/data-binder';
import IceLabel from '@icedesign/label';
import { enquireScreen } from 'enquire-js';
import SubCategoryItem from './SubCategoryItem';
import './ComplexTabTable.scss';
import { Link } from 'react-router'
import { ajaxTo,baseURL } from '../../../../util/util';
import ReactEcharts from 'echarts-for-react';
import Num from '../../../../assets/img/num.png'
import Average from '../../../../assets/img/average.png'
import Finish from '../../../../assets/img/finish.png'
import Score from '../../../../assets/img/score.png'
import Shorttime from '../../../../assets/img/shorttime.png'

const aStyle={
  display:"inline-block",
  color:"#5485F7",
  marginLeft:"1rem",
  cursor:'pointer'
}

const { Row,Col } = Grid
const spans = {
  xl:4,
  l:4,
  m:5,
  s:6,
  xs:10,
  xxs:14
}
//配置项
let echartsOption = { } 
export default class ComplexTabTable extends Component {
  static displayName = 'ComplexTabTable';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      cateid:0
    };
  }



  componentWillMount(){
    let _this = this
    let _id = this.props.newData.history.params.id
    _this.getCategory()
    if(_id){
      _this.getDetailInfo(_id)
    }else{
      _this.getDetailInfo(0)
    }
    this.setState({
      cateid:_id
    })
    _this.getWrong()
  }

  /**
   * 错题top5
   */
  getWrong = () => {
    let _this = this
    ajaxTo('/api.php?entry=sys&c=group&a=record&do=errno_subjects')
    .then((res) => {
      if(res.status == 1){
        let wrong = []
        if(res.data){
          res.data.map((v,i) => {
            wrong.push({
              id:v.subject.id,
              title:v.subject.title,
              status:v.subject.status == 1 ? '开启' : '关闭',
              error:v.error_rate + '%',
              second:v.second
            })
          })
        }
        _this.setState({
          wrong
        })
      }
    })
  }

  /**
   * 分组筛选
   */
  getCategory = () => {
    let _this = this
    ajaxTo('/api.php?entry=sys&c=group&a=real&do=group_list')
    .then((res) => {
      if(res.status == 1){
        let category = res.data || []
        category.splice(0,0,{id: "0", gname: "全部"})
        _this.setState({
          category
        })
      }
    })
  }

  /**
   * 获取信息统计
   * @param {分类的id} type 
   */
  getDetailInfo = (type) => {
    let _this = this
    ajaxTo('/api.php?entry=sys&c=group&a=real&do=realTime',{gid:type})
    .then((res) => {
      if(res.status == 1){
        let detailInfo = res.data
        if(detailInfo){
          detailInfo.alltime = _this.getTime(detailInfo.alltime.timepoor,'min') + 'min' + _this.getTime(detailInfo.alltime.timepoor,'sec') + 's'
          detailInfo.averageTime = _this.getTime(detailInfo.averageTime,'min') + 'min' + _this.getTime(detailInfo.averageTime,'sec') + 's'
        }
        _this.setState({
          detailInfo
        })
      }
    })
  }

  /**
   * 计算时间的分钟和秒数
   * @param {*} time 
   */
  getTime = (time,type) => {
    let min = Math.floor(Number(time) / 60)
    let sec = Math.floor(Number(time) % 60)
    if(type == 'min'){
      return min
    }else{
      return sec
    }
  }



  onSelect(type, value) {
    this.getDetailInfo(value)
  }

  render() {
    let { average,wrongs,category,detailInfo,wrong,cateid } = this.state
    
    const renderOper = (value, index, record) => {
      const wrongrecord = '/wrongrecord/'+record.id
      let exportUrl = baseURL + 'api.php?entry=sys&c=group&a=record_export&do=subject_export&sid='+record.id
      return (
        <div style={{display:'flex',flexDirection:'row'}}>
          <Link to={wrongrecord} style={{marginRight:'20px',color:'#289ffa'}}>错题记录</Link>
          <a style={{color:'#289ffa',cursor:'pointer'}} href={exportUrl}>单题记录导出</a>
        </div>
        
      );
    };
    return (
      <div className="complex-tab-table">
        <IceContainer style={{padding:'20px 40px'}}>
          <Row>
            <Col className="headerleft" span={12}>
              <Select
                placeholder="全部"
                onChange={this.onSelect.bind(this, "size")}
                style={{width:'300px'}}
                defaultValue={cateid}
              >
                {category ? category.map((v,i) => (
                  <Option value={v.id}>{v.gname}</Option>
                )) : null}
              </Select>

              <div className="staticsbox">
                {/* 参加人数 */}
                <div className="staticitem">
                  <img className="iconitem" src={Num} alt=""/>
                  <div className="iteminfo">
                    <div className="itemtitle">参加人数</div>
                    <div className="itemnum">{detailInfo ? detailInfo.participants : null}</div>
                  </div>
                </div>

                {/* 平均成绩 */}
                <div className="staticitem">
                  <img className="iconitem" src={Score} alt=""/>
                  <div className="iteminfo">
                    <div className="itemtitle">平均成绩</div>
                    <div className="itemnum">{detailInfo ? detailInfo.average : null}</div>
                  </div>
                </div>

                {/* 已完成人数 */}
                <div className="staticitem">
                  <img className="iconitem" src={Finish} alt=""/>
                  <div className="iteminfo">
                    <div className="itemtitle">已完成人数</div>
                    <div className="itemnum">{detailInfo ? detailInfo.allparticipants : null}</div>
                  </div>
                </div>

                {/* 平均用时 */}
                <div className="staticitem">
                  <img className="iconitem" src={Average} alt=""/>
                  <div className="iteminfo">
                    <div className="itemtitle">平均用时</div>
                    <div className="itemnum">{detailInfo ? detailInfo.averageTime : null}</div>
                  </div>
                </div>

                 {/* 最短用时 */}
                 <div className="staticitem">
                  <img className="iconitem" src={Shorttime} alt=""/>
                  <div className="iteminfo">
                    <div className="itemtitle">最短用时</div>
                    <div className="itemnum">{detailInfo ? detailInfo.alltime : null}</div>
                  </div>
                </div>
              </div>
            </Col>
            <Col className="headerright" span={12} style={{position:'relative'}}>
              <div
                style={{ width: 300,height:250,overflow:'hidden',position:'absolute',top:'0px',left:'0px',color:'#fff'}}
              >
                <div className="userbox">
                  <div style={{width:'100%',textAlign:'center',background:'#000',height:'40px',lineHeight:'40px'}}>分数排行榜</div>
                  <div className="users">
                    {detailInfo ? detailInfo.alltotal.map((v,i) => (
                      <p className="userscore">
                        <div className="name">{i+1}.{v.username}</div>
                        <div className="score">得分 {v.total}</div>
                      </p>
                    )) : null}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row style={{width:'100%',display:'flex',flexDirection:'column',padding:'15px 0px'}}>
            <h1>错题TOP5</h1>
            <Table dataSource={wrong}>
              <Table.Column title="编号" dataIndex="id" />
              <Table.Column title="题目" dataIndex="title" />
              <Table.Column title="状态" dataIndex="status" />
              <Table.Column title="错题率" dataIndex="error" />
              <Table.Column title="被答次数" dataIndex="second" />
              <Table.Column title="操作" cell={renderOper} width="20%" />
            </Table>
            <div className="more"><Link to="/staticsmore" className="moreword">More > ></Link></div>
          </Row>
          
        </IceContainer>
      </div>
    )
  }
}



