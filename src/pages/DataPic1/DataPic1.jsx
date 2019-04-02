import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import {ajaxTo} from '../../util/util';
import { Chart, Axis, Tooltip, Geom } from 'bizcharts';
import DataSet from '@antv/data-set';


export default class DataPic1 extends Component {
  static displayName = 'DataPic1';

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
    console.log(this.props.params.id)
    const id=this.props.params.id;
    ajaxTo('api.php?entry=sys&c=group&a=groups&do=dataView',{gid:id})
    .then(function(res){
      console.log(res);
      that.setState({
        data:res.data
      })
    })
  }
  render() {

    const data =this.state.data;
    const ds = new DataSet();
    const dv = ds.createView().source(data);
    dv.transform({
      type: 'fold',
      fields: ['DAY1', 'DAY2', 'DAY3'],
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
              <span>完成情况</span>
            </div>
          </div>
          <div style={styles.coreData}>
            <div style={styles.coreDataDesc}>
              <span
                style={{ ...styles.indicator, backgroundColor: '#D5D8DC' }}
              />
              <span>平均分</span>
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
      </IceContainer>
    );
  }
}

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
