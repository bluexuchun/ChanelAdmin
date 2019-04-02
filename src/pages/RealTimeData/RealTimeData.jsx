import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import {ajaxTo} from '../../util/util';
import { Chart, Axis, Tooltip, Geom } from 'bizcharts';
import DataSet from '@antv/data-set';
import PieChart from '../../components/PieChart';
import TopList from '../../components/TopList';
import StatisticalCard from '../../components/StatisticalCard/StatisticalCard';
import {
  Input,
  Button,
  Checkbox,
  Select,
  DatePicker,
  Switch,
  Radio,
  Grid,
  Upload
} from '@icedesign/base';
const {Row, Col} = Grid;

const data = {
  topShop: [
    {
      name: '凑味咖啡鼓浪屿纯手工人气',
    },
    {
      name: '农味美食店',
    },
    {
      name: '爱生气起泡米酒',
    },
    {
      name: '黎平县原生态官方企业 ',
    },
    {
      name: '起泡酒大礼包 爱格尼蓝海之鲸天使之手气泡酒',
    },
    {
      name: '一杯 精选气泡酒 Italy原瓶进口天使之手Moscato甜白葡萄微起泡酒',
    },
    {
      name: '精选红酒 炒鸡好喝的德国巧克力红酒250ml浓香丝滑爽爆',
    },
    {
      name: '【爱上红枣】爱生气红枣米酒冬酿鲜米酒低度女士甜酒果酒稠酒6瓶',
    },
  ],
  topItem: [
    {
      name: '起泡酒大礼包 爱格尼蓝海之鲸天使之手气泡酒',
    },
    {
      name: '一杯 精选气泡酒 Italy原瓶进口天使之手Moscato甜白葡萄微起泡酒',
    },
    {
      name: '精选红酒 炒鸡好喝的德国巧克力红酒250ml浓香丝滑爽爆',
    },
    {
      name: '【爱上红枣】爱生气红枣米酒冬酿鲜米酒低度女士甜酒果酒稠酒6瓶',
    },
  ],
  target: [
    {
      value: 120,
      name: '完成',
    },
    {
      value: 80,
      name: '未完成',
    },
  ]

};

export default class RealTimeData extends Component {
  static displayName = 'RealTimeData';

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.queryCache = {};
    this.state = {
      status:false

    };
  }

  componentWillMount() {
    var that=this;
    console.log(this.props);
    const gid=this.props.params.id;
    ajaxTo('api.php?entry=sys&c=group&a=real&do=realTime',{gid:gid})
    .then(function(res){
      console.log(res);
      const total=parseInt(res.data.participants);
      const finsh=parseInt(res.data.allparticipants);
      var num,lastnum,nextnum,second;
      var  alltimelist=res.data.alltime;
      var maxnumdata=res.data.alltotal;
      var maxnumlist=[];
      for(var i=0;i<alltimelist.length;i++){
        num=parseInt(alltimelist[i].timepoor);
        console.log(num);
        lastnum=Math.floor(num/60);
        console.log(lastnum);
        // console.log(lastnum);
        nextnum=num%60;
        second=nextnum==0?'':nextnum+'s';
        console.log(nextnum);
        // console.log(lastnum,nextnum);
        alltimelist[i].timepoor=alltimelist[i].username+' 用时 '+lastnum+'min '+second
        alltimelist[i].time=lastnum+'min '+second;
        maxnumlist.push({name:maxnumdata[i].username+' 得分 '+maxnumdata[i].total})
      }
      console.log(alltimelist);
      //分数最高列表
      console.log(maxnumlist);
      const mintimelist=[];
      for(var k=0;k<alltimelist.length;k++){
        //用时最少的列表
        mintimelist.push({name:alltimelist[k].timepoor});
      }
      console.log(mintimelist);
      const bilv=[];
      bilv[0]={
        value: finsh,
        name: '完成',
      };
      bilv[1]={
        value: total-finsh,
        name: '未完成',
      }
      //完成未完成的比例
      console.log(bilv);
      var alldata=[];
      alldata.push({pingjunfenshu:res.data.average});
      alldata.push({pingjunshijian:res.data.averageTime});
      alldata.push({canyurenshu:total});
      alldata.push({wanchengrenshu:finsh});
      alldata.push({zuiduanshijian:alltimelist[0].time})
      that.setState({
        mintimelist:mintimelist,
        maxnumlist:maxnumlist,
        bilv:bilv,
        alldata:alldata
      })
    })

  }
  componentWillReceiveProps(){
    var that=this;
    this.timer=setInterval(
                () => {
                  console.log('1111');


                  console.log(this.props);
                  const gid=this.props.params.id;
                  ajaxTo('api.php?entry=sys&c=group&a=real&do=realTime',{gid:gid})
                  .then(function(res){
                    console.log(res);
                    const total=parseInt(res.data.participants);
                    const finsh=parseInt(res.data.allparticipants);
                    var num,lastnum,nextnum,second;
                    var  alltimelist=res.data.alltime;
                    var maxnumdata=res.data.alltotal;
                    var maxnumlist=[];
                    for(var i=0;i<alltimelist.length;i++){
                      num=parseInt(alltimelist[i].timepoor);
                      console.log(num);
                      lastnum=Math.floor(num/60);
                      console.log(lastnum);
                      // console.log(lastnum);
                      nextnum=num%60;
                      second=nextnum==0?'':nextnum+'s';
                      console.log(nextnum);
                      // console.log(lastnum,nextnum);
                      alltimelist[i].timepoor=alltimelist[i].username+' 用时 '+lastnum+'min '+second
                      alltimelist[i].time=lastnum+'min '+second;
                      maxnumlist.push({name:maxnumdata[i].username+' 得分 '+maxnumdata[i].total})
                    }
                    console.log(alltimelist);
                    //分数最高列表
                    console.log(maxnumlist);
                    const mintimelist=[];
                    for(var k=0;k<alltimelist.length;k++){
                      //用时最少的列表
                      mintimelist.push({name:alltimelist[k].timepoor});
                    }
                    console.log(mintimelist);
                    const bilv=[];
                    bilv[0]={
                      value: finsh,
                      name: '完成',
                    };
                    bilv[1]={
                      value: total-finsh,
                      name: '未完成',
                    }
                    //完成未完成的比例
                    console.log(bilv);
                    var alldata=[];
                    alldata.push({pingjunfenshu:res.data.average});
                    alldata.push({pingjunshijian:res.data.averageTime});
                    alldata.push({canyurenshu:total});
                    alldata.push({wanchengrenshu:finsh});
                    alldata.push({zuiduanshijian:alltimelist[0].time})
                    that.setState({
                      mintimelist:mintimelist,
                      maxnumlist:maxnumlist,
                      bilv:bilv,
                      alldata:alldata
                    })
                  })
                },
                5000
            );

  }
  render() {
    return (
      <IceContainer title="数据图表">
        <StatisticalCard data={this.state.alldata}/>
        <Row style={styles.formItem}>
          <Col style={styles.formLabel}>
            <div style={styles.container1}>
              <PieChart data={this.state.bilv} title="完成与未完成比例" />
            </div>
          </Col>
          <Col style={styles.formLabel}>
            <div style={styles.container1}>
              <TopList data={this.state.mintimelist} title="用时最少排行" />
            </div>
          </Col>
          <Col style={styles.formLabel}>
            <div style={styles.container1}>
              <TopList data={this.state.maxnumlist} title="分数最高排行" />
            </div>
          </Col>
        </Row>








      </IceContainer>
    );
  }
}

const styles = {
  container1: {
    backgroundColor: '#fff',
    width:'300px',
    color: '#fff',
    height: '600px',
    marginRight:"30px"
  },
  main: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
  },
  bg: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },
  side: {
    zIndex: 1,
    width: '320px',
    padding: '10px',
  },
  middle: {
    flex: 1,
  },
  header: {
    textAlign: 'center',
  },
  pageTitle: {
    fontSize: '36px',
    margin: 0,
  },
  time: {
    marginBottom: 20,
  },
  sum: {
    height: '44px',
    lineHeight: '44px',
    margin: '25px 0 0',
    color: '#fff600',
    fontSize: '62px',
    fontWeight: 400,
  },
};
