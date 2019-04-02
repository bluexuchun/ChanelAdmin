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

    };
  }



  componentWillMount(){
    let _this = this
    _this.getWrong()
  }

  /**
   * 获取所有错题
   */
  getWrong = () => {
    let _this = this
    ajaxTo('/api.php?entry=sys&c=group&a=record&do=errno_subjects',{type:'more'})
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

  render() {
    let { wrong } = this.state
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
          <Row style={{width:'100%',display:'flex',flexDirection:'column',padding:'15px 0px'}}>
            <h1>错题</h1>
            <Table dataSource={wrong}>
              <Table.Column title="编号" dataIndex="id" />
              <Table.Column title="题目" dataIndex="title" />
              <Table.Column title="状态" dataIndex="status" />
              <Table.Column title="错题率" dataIndex="error" />
              <Table.Column title="被答次数" dataIndex="second" />
              <Table.Column title="操作" cell={renderOper} width="20%" />
            </Table>
          </Row>
        </IceContainer>
      </div>
    )
  }
}



