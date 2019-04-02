import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { enquireScreen } from 'enquire-js';
import { Balloon, Icon, Grid } from '@icedesign/base';

const { Row, Col } = Grid;



export default class StatisticalCard extends Component {
  static displayName = 'StatisticalCard';

  constructor(props) {
    super(props);
    this.state = {
      isMobile: false,
    };
  }

  componentDidMount() {
    console.log(this.props);
    this.enquireScreenRegister();
  }

  enquireScreenRegister = () => {
    const mediaCondition = 'only screen and (max-width: 720px)';

    enquireScreen((mobile) => {
      this.setState({
        isMobile: mobile,
      });
    }, mediaCondition);
  };

  renderItem = () => {
    var  dataSource = [
      {
        text: '参加人数',number: '6,657',imgUrl: require('./images/f6.png'),desc: '参加阶段测试的人数',
      },
      {
        text: '已完成人数',number: '12,896',imgUrl: require('./images/f7.png'),desc: '完成阶段测试的人数',
      },
      {
        text: '最短用时',number: '9,157',  imgUrl: require('./images/f8.png'),desc: '最快答题',
      },
      {
        text: '平均成绩',number: '6,682',imgUrl: require('./images/f9.png'),desc: '所有答题的平均成绩',
      },
      {
        text: '平均用时',number: '6,682',imgUrl: require('./images/f10.png'),desc: '所有答题的平均用时',
      },
    ];
    const dataList=[];
    var num,min,second,num1;
    if(this.props.data){
       num=this.props.data[1].pingjunshijian;
       min=Math.floor(num/60);
       num1=num%60;
       second=num1==0?'':num1;

      dataSource[0].number=this.props.data[2].canyurenshu;
      dataSource[1].number=this.props.data[3].wanchengrenshu;
      dataSource[2].number=this.props.data[4].zuiduanshijian;
      dataSource[3].number=this.props.data[0].pingjunfenshu;
      dataSource[4].number=min+'min'+second+'s';
    }
    console.log(dataList);


    const itemStyle = this.state.isMobile ? { justifyContent: 'left' } : {};
    return dataSource.map((data, idx) => {
      return (
        <Col xxs="12" s="6" l="3" key={idx} style={{marginRight:"45px"}}>
          <div style={{ ...styles.statisticalCardItem, ...itemStyle }}>
            <div style={styles.circleWrap}>
              <img src={data.imgUrl} style={styles.imgStyle} alt="图片" />
            </div>
            <div style={styles.statisticalCardDesc}>
              <div style={styles.statisticalCardText}>
                {data.text}
                <Balloon
                  align="t"
                  alignment="edge"
                  trigger={
                    <span>
                      <Icon type="help" style={styles.helpIcon} size="xs" />
                    </span>
                  }
                  closable={false}
                >
                  {data.desc}
                </Balloon>
              </div>
              <div style={styles.statisticalCardNumber}>{data.number}</div>
            </div>
          </div>
        </Col>
      );
    });
  };

  render() {
    return (
      <IceContainer style={styles.container}>
        <Row wrap>{this.renderItem()}</Row>
      </IceContainer>
    );
  }
}

const styles = {
  container: {

    padding: '10px 20px',
  },
  statisticalCardItem: {
    display: 'flex',
    justifyContent: 'center',
    padding: '10px 0',
  },
  circleWrap: {
    width: '70px',
    height: '70px',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50%',
    marginRight: '10px',
  },
  imgStyle: {
    maxWidth: '100%',
  },
  helpIcon: {
    marginLeft: '5px',
    color: '#b8b8b8',
  },
  statisticalCardDesc: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  statisticalCardText: {
    position: 'relative',
    color: '#333333',
    fontSize: '12px',
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  statisticalCardNumber: {
    color: '#333333',
    fontSize: '24px',
  },
  itemHelp: {
    width: '12px',
    height: '12px',
    position: 'absolute',
    top: '1px',
    right: '-15px',
  },
};
