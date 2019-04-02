import React, { Component } from 'react';
import TextLoop from 'react-text-loop';
import Title from './Title';

export default class TopList extends Component {
  static displayName = 'TopList';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log(this.props.data);

    return (
      <div style={{ height: '33%' }}>
        <Title data={this.props.title} />
        <ul style={styles.list}>
          {this.props.data?this.props.data.map((data, index) => {
            return (
              <TextLoop key={index}>
                <li style={styles.item}>
                  <span style={styles.idx}>No.{index + 1}</span>
                  <span style={styles.name}>{data.name}</span>
                </li>
              </TextLoop>
            );
          }):null}
        </ul>
      </div>
    );
  }
}

const styles = {
  list: {
    color: '#000',
    lineHeight: '36px',
    width: '300px',
    marginTop: '20px',
  },
  item: {
    marginRight:'100px',
    borderBottom: '1px solid #000',
    width: '300px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  name: {
    marginLeft: '10px',
  },
};
