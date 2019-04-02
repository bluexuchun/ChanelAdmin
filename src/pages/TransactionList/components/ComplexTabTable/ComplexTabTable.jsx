/* eslint no-underscore-dangle:0 */
import React, { Component } from 'react';
import { Table, Pagination, Tab, Search ,Button,Grid,Card,Input,Select,Feedback } from '@icedesign/base';
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
import './ComplexTabTable.scss'
import Close from '../../../../assets/img/close.png'


const aStyle={
  display:"inline-block",
  color:"#5485F7",
  marginLeft:"1rem",
  cursor:'pointer'
}

const Toast = Feedback.toast;

const { Row,Col } = Grid
const spans = {
  xl:2,
  l:2,
  m:2,
  s:2,
  xs:2,
  xxs:2
}
export default class ComplexTabTable extends Component {
  static displayName = 'ComplexTabTable';

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      alertShow:false,
      dateActive:0,
      yearActive:0,
      cityActive:0,
      echartsOption:{}
    };
  }



  componentWillMount(){
    let _this = this
    _this.initRecord()
    _this.getYear()
    _this.getDate()
    _this.getCity()
  }

  /**
   * 年份
   */
  getYear = () => {
    let _this = this
    let years = ['全部']
    ajaxTo('api.php?entry=sys&c=group&a=value&do=year')
    .then((res) => {
      if(res.data){
        res.data.map((v,i) => {
          years.push(v)
        })
      }
      _this.setState({
        years
      })
    })
  }

  /**
   * 期数
   */
  getDate = () => {
    let _this = this
    let dates = [{'batch':'全部'}]
    ajaxTo('api.php?entry=sys&c=group&a=value&do=batch')
    .then((res) => {
      if(res.data){
        res.data.map((v,i) => {
          dates.push(v)
        })
      }
      _this.setState({
        dates
      })
    })
  }

  /**
   * 城市
   */
  getCity = () => {
    let _this = this
    let citys = [{'city':'全部'}]
    ajaxTo('api.php?entry=sys&c=group&a=value&do=county')
    .then((res) => {
      if(res.data){
        res.data.map((v,i) => {
          citys.push(v)
        })
      }
      _this.setState({
        citys
      })
    })
  }

  /**
   * initRecord
   */
  initRecord = () => {
    let _this = this
    ajaxTo('api.php?entry=sys&c=group&a=value&do=value')
    .then((res) => {
      if(res.status == 1){
        if(res.data){
          let datalist = res.data.day || []
          let alldays = 0
          datalist.map((v,i) =>{
            if(v.finish != 0 || v.full != 0){
              alldays ++
            }
          })
          let ary1 = [], ary2 = []
          _this.setState({
            ...res.data,
            alldays
          })
          if(datalist.length > 0){
            datalist.map((v,i) => {
              ary1.push(v.finish)
              ary2.push(v.full)
            })
            _this.drawCharts(ary1,ary2)
          }
        }
      }else{
        Toast.error(res.message)
      }
    })
  }

  /**
   * init
   */
  init = (batch,year,city) => {
    let _this = this
    ajaxTo('api.php?entry=sys&c=group&a=screen&do=day_screen',{
      batch:batch,
      year:year,
      city:city,
      stage:2
    })
    .then((res) => {
      if(res.status == 1){
        if(res.data){
          let datalist = res.data.day || []
          let alldays = 0
          datalist.map((v,i) =>{
            if(v.finish != 0 || v.full != 0){
              alldays ++
            }
          })
          let ary1 = [], ary2 = []
          _this.setState({
            ...res.data,
            alldays
          })
          if(datalist.length > 0){
            datalist.map((v,i) => {
              ary1.push(v.finish)
              ary2.push(v.full)
            })
            _this.drawCharts(ary1,ary2)
          }
        }
      }else{
        Toast.error(res.message)
      }
    })
  }

  /**
   * 绘制图表
   * ary1 预习完成率
   * ary2 满分比例
   **/ 
  drawCharts = (ary1,ary2) => {
    let { echartsOption } = this.state
    echartsOption = {
      title: {
          text: ''
      },
      legend: {
        data:['预习完成率','满分比例'],
        top:'bottom',
        left:'10%'
      },
      tooltip: {
        trigger:'axis',
        axisPointer: {
          type: 'none',
          label: {
              show: true
          }
        }
      },
      xAxis: [
        {
          type:'category',
          data: ['DAY1', 'DAY2', 'DAY3']
        }
      ],
      yAxis: [
        {
          type:'value',
          min:0,
          max:100,
          interval:25
        }
      ],
      series: [
        {
          name:'预习完成率',
          type:'bar',
          data:ary1,
          barGap:'0%',
          barWidth:'40',
          itemStyle:{
            color:'#ffe2d4'
          }
        },{
          name:'满分比例',
          type:'bar',
          data:ary2,
          barGap:'0%',
          barWidth:'40',
          itemStyle:{
            color:'#ff7d7d'
          }
        }
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: function (idx) {
          return idx * 1;
      }
    }
    this.setState({
      echartsOption
    })
  }
  componentDidMount(){

  }

  onChartClick = (e) => {
    this.setState({
      alertShow:true,
      boxtitle:e.name,
      dataIndex:e.dataIndex,
      seriesIndex:e.seriesIndex,
      seriesName:e.seriesName
    })
    console.log(e)
  }

  onChangeSelect = (value,option,type) => {
    if(value == '全部'){
      value = 0
    }
    this.setState({
      [type]:value
    })
  }

  choseCondition = () => {
    let _this = this
    let { dateActive,yearActive,cityActive } = this.state
    // if(dateActive == null && yearActive == null && cityActive == null){
    //   Toast.error("请选择条件");
    //   return false
    // }
    _this.init(dateActive,yearActive,cityActive)
  }

  exportExcel = () => {
    let _this = this
    let { dateActive,yearActive,cityActive } = this.state
    // if(dateActive == null && yearActive == null && cityActive == null){
    //   Toast.error("请选择条件");
    //   return false
    // }
    ajaxTo('api.php?entry=sys&c=group&a=screen&do=day_screen',{
      batch:dateActive,
      year:yearActive,
      city:cityActive
    })
    .then((res) => {
      if(res.status == 1){
        window.location.href = baseURL + "api.php?entry=sys&c=group&a=day_screens&do=day_screen" + '&batch=' + dateActive + '&year=' + yearActive + '&city=' + cityActive
      }else{
        Toast.error(res.message)
      }
    })
  }

  render() {
    let { alertShow,dates,years,citys,allmon,average,full,alldays,echartsOption,dataIndex,day,boxtitle,seriesIndex,seriesName } = this.state
    let fullRate,finishMen,notFinish

    if(seriesIndex == 0){
      fullRate =  day ? day[dataIndex] ? day[dataIndex].finish : null : null
      finishMen = (allmon * (fullRate * 0.01)).toFixed(0)
      notFinish = allmon - finishMen
    }else{
      fullRate =  day ? day[dataIndex] ? day[dataIndex].full : null : null
      finishMen = day ? day[dataIndex] ? day[dataIndex].average : null : null
      notFinish = day ? day[dataIndex] ? day[dataIndex].marks : null : null
    }
    
    let onEvents = {
      'click':this.onChartClick
    }
    return (
      <div className="complex-tab-table">

        <IceContainer style={{position:'relative'}}>
          {/* 弹窗 */}
          <div className="alertModel" style={{display:alertShow ? 'flex' : 'none'}}>
            <img className="alertClose" src={Close} onClick={() => this.setState({alertShow:false})} />
            <div className="alertTitle">{ seriesIndex == 0 ? boxtitle + '预习完成率' : boxtitle + '满分比例'}</div>
            <div className="alertContent">
              <div className="contentItem">
                <div className="itemTitle">{seriesIndex == 0 ? '预习完成率' : '满分比例'}</div>
                <div className="itemData">{fullRate}%</div>
              </div>
              <div className="contentItem">
                <div className="itemTitle">{seriesIndex == 0 ? '完成人数' : '平均分'}</div>
                <div className="itemData">{finishMen}</div>
              </div>
              <div className="contentItem">
                <div className="itemTitle">{seriesIndex == 0 ? '未完成人数' : '满分人数'}</div>
                <div className="itemData">{notFinish}</div>
              </div>
            </div>
          </div>

          <div style={styles.tableFilter}>
            <div style={styles.filter}>
              <div style={styles.filterItem}>
                <Select style={{ width: '150px' }} placeholder="请选择期数" onChange={(value,option,type) => this.onChangeSelect(value,option,'dateActive')}>
                  { dates ? 
                    dates.map((v,i) => (
                      <Select.Option value={v.batch} key={i}>{v.batch}</Select.Option>
                    ))
                    :
                    null
                  }
                  
                </Select>
              </div>
              <div style={styles.filterItem}>
                <Select style={{ width: '150px' }} placeholder="请选择年份"  onChange={(value,option,type) => this.onChangeSelect(value,option,'yearActive')}>
                  { years ? 
                    years.map((v,i) => (
                      <Select.Option value={v} key={i}>{v}</Select.Option>
                    ))
                    :
                    null
                  }
                </Select>
              </div>
              <div style={styles.filterItem}>
                <Select style={{ width: '150px' }} placeholder="请选择城市" onChange={(value,option,type) => this.onChangeSelect(value,option,'cityActive')}>
                  { citys ? 
                    citys.map((v,i) => (
                      <Select.Option value={v.city} key={i}>{v.city}</Select.Option>
                    ))
                    :
                    null
                  }
                </Select>
              </div>
              <div style={styles.submitButton} onClick={() => this.choseCondition()}>
                筛选
              </div>
              <div style={styles.submitButton} onClick={() => this.exportExcel()}>
                导出
              </div>
            </div>
          </div>
          <Row justify="start" style={{width:'100%',padding:'0px 20px'}}>
            <Col span="2" {...spans} style={{marginLeft:'20px'}}>
              <div className="cardtitle">平均分</div>
              <div className="carditem">{average}</div>
            </Col>  
            <Col span="2" {...spans}>
              <div className="cardtitle">完成率</div>
              <div className="carditem">{full}%</div>
            </Col>
            <Col style={{marginLeft:'40px'}}>
              <div className="tjword" style={{marginBottom:'8px'}}>培训人数:{allmon}人</div>
              <div className="tjword">培训天数:{alldays}天</div>
            </Col>
          </Row>
          
          <ReactEcharts
            ref={(e) => { this.echartsElement = e }}
            option={echartsOption}
            onEvents={onEvents}
            style={{width:'600px',height:'400px'}}
          />
        </IceContainer>
      </div>
    )
  }
}

const styles = {
  tableFilter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px',
    marginBottom: '20px',
    background: '#fff',
  },
  title: {
    height: '20px',
    lineHeight: '20px',
    color: '#333',
    fontSize: '18px',
    fontWeight: 'bold',
    paddingLeft: '12px',
    borderLeft: '4px solid #666',
  },
  filter: {
    display: 'flex',
  },
  filterItem: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '20px',
  },
  filterLabel: {
    fontWeight: '500',
    color: '#999',
  },
  submitButton: {
    width:'150px',
    background: '#313131',
    color:'#fff',
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    marginLeft:'15px',
    cursor:'pointer'
  },
  carditem:{
    fontSize:'22px'
  }
};


