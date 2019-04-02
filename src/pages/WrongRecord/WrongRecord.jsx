import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Table ,Icon,Grid} from '@icedesign/base';
import {ajaxTo,baseURL} from '../../util/util';
import { Chart, Axis, Tooltip, Geom } from 'bizcharts';
import DataSet from '@antv/data-set';
import './InfoDisplayTable.scss';
import Right from '../../assets/img/right.png'

const { Row, Col } = Grid;

const dataSource = () => {
  return [
    {
      label: '姓名',
      value: <div>孙东波 <Icon type="select" style={{color:'green'}}/></div>,
    },
    {
      label: '性别',
      value: '男',
    },
    {
      label: '年龄',
      value: '25',
    },
    {
      label: '籍贯',
      value: '杭州',
    },
    {
      label: '职业',
      value: '程序员',
    },
  ];
};
const Eng=['A选项','B选项','C选项','D选项','E选项','F选项','G选项','H选项'];
const en = ['A','B','C']

export default class WrongRecord extends Component {
  static displayName = 'WrongRecord';

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.queryCache = {};
    this.state = {
      data:[]

    };
  }

  componentWillMount() {
    const that=this;
    //小组id
    const groupid=this.props.location.query.gid;
    //题目id
    const id=this.props.params.id;
    let exportUrl = baseURL + 'api.php?entry=sys&c=group&a=record_export&do=subject_export&sid='+id
    ajaxTo('api.php?entry=sys&c=group&a=record&do=errorRecord',{sid:id,gid:groupid?groupid:''})
    .then(function(res){
      that.setState({
        data:res.data,
        total:res.total,
        exportUrl
      })
    })
    ajaxTo('api.php?entry=sys&c=column&a=record&do=record', {'id': id})
    .then(function(res){
      const dataList=[];
      const arr=res.data.content;
      var data1,data2;
      for(var i=0;i<arr.length;i++){
        data1=arr[i].judge;
        data2=arr[i].status=='true'?<img src={Right} style={{color:'green',width:'20px',height:'20px',marginRight:'6px'}}/>:<div style={{width:'20px',height:'20px'}}></div>;
        dataList.push({
          label: <div style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>{data2} {Eng[i]}</div>,
          value: <div>{data1}</div>,
          nums:<div>{arr[i].total}</div>
        })
      }
      that.setState({
        TMtitle:'题目：'+res.data.title,
        dataList:dataList,
      })
    })

  }


  render() {
    let { total,exportUrl } = this.state
    const data =this.state.data;
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: 'fold',
      fields: ['A', 'B', 'C', 'D', 'E','F','G'],
      key: '天数',
      value: '分数',
    })
    return (
      <IceContainer>
        <div className="info-display-table">
          <div style={styles.flexable}>
            <div style={{width:'450px',fontSize:'18px'}}>{this.state.TMtitle}</div>
            <div style={{width:'150px',textAlign:'center',fontSize:'18px',fontWeight:'600'}}>总答题次数:{total}</div>
            <a style={styles.exportbtn} href={exportUrl}>导出</a>
          </div>
          <Table dataSource={this.state.dataList} style={styles.infoDisplayTable}>
            <Table.Column title="" dataIndex="label" width="150px" />
            <Table.Column title="" dataIndex="value" width="300px" />
            <Table.Column title="" dataIndex="nums" width="150px" />
          </Table>
        </div>
        <div style={styles.coreDataChartWrapper}>
          <Chart padding={[40, 40, 40, 40]} height={300} data={dv} forceFit>
            <Axis name="天数" />
            <Axis name="分数" />
            <Tooltip crosshairs={{ type: 'y' }} />
            <Geom
              type="interval"
              position="天数*分数"
              color={['name', ['#F6DDCC', '#D5D8DC']]}
              adjust={[{ type: 'dodge', marginRatio: 1 / 32 }]}
            />
          </Chart>
        </div>
      </IceContainer>
    );
  }
}

const styles = {
  flexable:{
    display:'flex',
    flexDirection:'row',
    alignItems:'center'
  },
  infoDisplayTable: {
    width:'610px'
  },
  coreDataTitle: {
    color: '#666',
    fontSize: 12,
  },
  coreDataWrapper: {
    marginTop: 10,
    display: 'flex',
  },
  coreData: {
    marginRight: 50,
  },
  coreDataCount: {
    fontSize: 30,
  },
  coreDataDesc: {
    display: 'flex',
    alignItems: 'center',
  },
  indicator: {
    display: 'inline-block',
    marginRight: 5,
    height: '3px',
    width: '15px',
  },
  exportbtn:{
    width: '150px',
    padding:'8px 0px',
    background: 'rgb(49, 49, 49)',
    color: 'rgb(255, 255, 255)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '25px',
    cursor: 'pointer'
  }
};
