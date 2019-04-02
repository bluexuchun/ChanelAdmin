import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Table ,Icon} from '@icedesign/base';
import {ajaxTo} from '../../util/util';
import { Chart, Axis, Tooltip, Geom } from 'bizcharts';
import DataSet from '@antv/data-set';
import './InfoDisplayTable.scss';

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

export default class Wrong extends Component {
  static displayName = 'Wrong';

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
    console.log(groupid);
    console.log(this.props)
    //题目id
    const id=this.props.params.id;
    ajaxTo('/api.php?entry=sys&c=group&a=record&do=errorRecord',{sid:id,gid:groupid?groupid:''})
    .then(function(res){
      console.log(res);
      that.setState({
        data:res.data
      })
    })
    ajaxTo('api.php?entry=sys&c=column&a=subjects&do=edit', {'id': id})
    .then(function(res){
      const dataList=[];
      const arr=res.data.content;
      var data1,data2;
      for(var i=0;i<arr.length;i++){
        data1=arr[i].judge;
        data2=arr[i].status=='true'?<Icon type="select" style={{color:'green'}}/>:null;
        dataList.push({
          label: Eng[i],
          value: <div>{data1} {data2}</div>,
        })
      }
      console.log(dataList);
      console.log(res);
      // const TMtitle=
      that.setState({
        TMtitle:'题目：'+res.data.title,
        dataList:dataList,
      })
    })

  }


  render() {

    const data =this.state.data;
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: 'fold',
      fields: ['A', 'B', 'C', 'D', 'E','F','G'],
      key: '天数',
      value: '分数',
    });
    return (
      <IceContainer title="数据图表">
        <div style={styles.coreDataWrapper}>
          <div style={styles.coreData}>
            <div style={styles.coreDataDesc}>
              <span
                style={{ ...styles.indicator, backgroundColor: '#000' }}
              />
              <span>选项选择次数</span>
            </div>
          </div>


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
        <div className="info-display-table" style={styles.infoDisplayTable}>
        <Table dataSource={this.state.dataList}>
          <Table.Column title={this.state.TMtitle} dataIndex="label" />
          <Table.Column title="" dataIndex="value" />
        </Table>
        </div>

      </IceContainer>



    );
  }
}

const styles1 = { infoDisplayTable: {} };
const styles = {
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
};
