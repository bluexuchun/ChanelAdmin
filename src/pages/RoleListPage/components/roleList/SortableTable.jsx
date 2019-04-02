import React, { Component } from 'react';
import IceContainer from '@icedesign/container';
import { Table, Icon, Button, Tab, Feedback } from '@icedesign/base';
import { Link } from 'react-router';
import axios from 'axios';
import uploadUrl,{ajaxTo,ajaxCors} from '../../../../util/util';

const TabPane = Tab.TabPane;


const tabs = [
  { tab: "角色权限列表", key: "0"},
  { tab: "角色权限编辑/添加", key: "1"},
];

export default class SortableTable extends Component {
  static displayName = 'SortableTable';

  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
    };
  }

  componentWillMount() {
    const that = this;
    const roleLists = ajaxTo('api.php?entry=sys&c=role&a=list',{})
    .then((res) => {
      console.log(res);
      if(res.status == 1){
        that.setState({
          dataSource:res.data
        })
      }
    })
    console.log(this.state.dataSource)
  }

  deleteRole = (index) => {
    const deleteResult = ajaxTo('api.php?entry=sys&c=role&a=list&do=delete',{
      id:index
    })
    .then((res) => {
      console.log(res);
      if(res.status == 1){
        Feedback.toast.success('删除成功');

      }
    })
  }

  // 点击tab的函数
  tabClick = (key) => {
    console.log(key);
    if(key == 1){
      this.props.history.router.push('/roleEditPage/create');
    }
  }

  render() {

    const renderSortButton = (value, index,record) => {
      return (
        <div>
          <Link to={'/roleEditPage/'+record.id} style={{marginRight: '15px'}}>编辑</Link>
          <Link onClick={this.deleteRole.bind(this,record.id)} style={{cursor:'pointer'}}>删除</Link>
        </div>
      );
    };

    return (
      <div className="sortable-table" style={styles.sortableTable}>
        <IceContainer>
          <Tab defaultActiveKey={0}>
            {tabs.map(item => (
              <TabPane key={item.key} tab={item.tab} onClick={this.tabClick}>

              </TabPane>
            ))}
          </Tab>
          <Table dataSource={this.state.dataSource} hasBorder={false}>
            <Table.Column width={80} title="Id" dataIndex="id"/>
            <Table.Column width={280} title="角色名" dataIndex="name" />
            <Table.Column width={240} title="备注" dataIndex="remark" />
            <Table.Column
              width={80}
              title="操作"
              cell={renderSortButton}
            />
          </Table>
        </IceContainer>
      </div>
    );
  }
}

const styles = {
  sortableTable: {},
};
