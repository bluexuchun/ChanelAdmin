import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router';
import {ajaxTo} from '../../../util/util';
import IceContainer from '@icedesign/container';
import {Feedback, Field} from '@icedesign/base';
import Img from '@icedesign/img';
import IceLabel from '@icedesign/label';
import {FormBinderWrapper as IceFormBinderWrapper, FormBinder as IceFormBinder, FormError as IceFormError} from '@icedesign/form-binder';
import {
  Table,
  Tab,
  Input,
  Button,
  Checkbox,
  Select,
  DatePicker,
  Switch,
  Radio,
  Grid,
  Upload,
  Pagination,
  Menu
} from '@icedesign/base';
const TabPane = Tab.TabPane;
const {Row, Col} = Grid;
const {Core} = Upload;
const {DragUpload} = Upload;
// FormBinder 用于获取表单组件的数据，通过标准受控 API value 和 onChange 来双向操作数据
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const {MonthPicker, YearPicker, RangePicker} = DatePicker;

// Switch 组件的选中等 props 是 checked 不符合表单规范的 value 在此做转换
const SwitchForForm = (props) => {
  const checked = props.checked === undefined
    ? props.value
    : props.checked;

  return (<Switch {...props} checked={checked} onChange={(currentChecked) => {
      if (props.onChange)
        props.onChange(currentChecked);
      }}/>);
};

const aStyle = {
  display: "inline-block",
  color: "#5485F7",
  marginLeft: "1rem",
  cursor: 'pointer'
}
const onRowClick = function(record, index, e) {
  console.log(record)

}
export default class CreateXiaoceshiForm extends Component {
  field = new Field(this);
  static displayName = 'CreateXiaoceshiForm';

  static defaultProps = {};

  constructor(props) {
    super(props);
    // console.log(this.props);
    this.state = {
      logoImg: '',
      logoImg1: '',
      value: {
        title: '',
        items: [{}]
      },
      btnword: '立即创建',
      // starttime: "2017-02-14",
      // endtime: "2017-03-24",
      getAllClass: "",
      currentKey: '1',
      //控制翻页
      isMobile: false,
      currentTab: 'solved',
      currentCategory: '1',
      ajaxUrl: 'api.php?entry=sys&c=column&a=subjects&do=insert'
    };
  }
  //获取题库列表
  componentWillMount() {
    console.log(this.props)
    const that = this;
    const result = ajaxTo('api.php?entry=sys&c=column&a=subjects&do=display', {cid: this.props.history.params.id});
    result.then(function(res) {
      console.log(res.data)

      that.setState({allData: res.data});
    })
  }
  //题库
  renderTitle = (value, index, record) => {
    return (<div style={styles.titleWrapper}>
      <div>
        <IceImg src={record.cover} width={48} height={48}/>
      </div>
      <span style={styles.title}>{record.title}</span>
    </div>);
  };

  deleteId = (id) => {
    console.log(id);
    ajaxTo('api.php?entry=sys&c=column&a=subjects&do=delete', {'id': id});
    let oldData = this.state.allData;
    for (var i = 0; i < oldData.length; i++) {
      if (oldData[i].id == id) {
        oldData.splice(i, 1);
        this.setState({allData: oldData})
      }
    }
    // let newCurrenData=this.state.allData.splice

  }
  editItem = (record, e) => {
    e.preventDefault();
    // TODO: record 为该行所对应的数据，可自定义操作行为
  };
  editorNum(id) {
    console.log(id);
    console.log('编辑顺序');
    const that = this;
    ajaxTo('api.php?entry=sys&c=column&a=subjects&do=edit', {'id': id}).then((res) => {
      console.log(res)
      const currentData = res.data;
      // console.log(activityId);
      // 返回的信息
      let items = [];
      currentData.content.map((item, index) => {
        items.push({
          judge: item.judge,
          status: item.status == "true"
            ? true
            : false,
          // fucenstatus: false,
          // borderStyle: false,
          // zhengqueborder: false,
          //
          // chuoduiorenglish: true,
          // fucenstatus: false,
          // // 选择的边框
          // borderStyle: false,
          // // 正确的边框
          // zhengqueborder: false,
          // isSelect: false,

        })
      })
      console.log(items)
      that.setState({
        value: {
          type: currentData.type,
          sel_type: currentData.sel_type,
          title: currentData.title,
          resolve: currentData.resolve,
          sort: currentData.sort,
          status: currentData.status == "1"
            ? true
            : false,

          items: items
        },
        btnword: '保存',
        ajaxUrl: 'api.php?entry=sys&c=column&a=subjects&do=update',
        logoImg: currentData.banner,
        logoImg1: currentData.picture,
        problem: id
      });
    })
    // ajaxTo('api.php?entry=sys&c=column&a=subjects&do=edit',{'id':id})
    // .then(res=>{
    //   console.log(res)
    // })
    this.setState({currentKey: '2'})
  }
  renderOperations = (value, index, record) => {
    // console.log(this.state.allData)
    // console.log(index)
    // const columnClassUrl=this.state.allData;
    const toUrl='/wrong/'+record.id;
    const toGroup='/grouperror/'+record.id;
    // console.log(record);
    return (<div style={styles.complexTabTableOperation}>
      {this.props.history.params.id==-19?<Link to={toUrl}>错题记录</Link>:null}
      {this.props.history.params.id==-19?<Link to={toGroup} style={aStyle}>小组错题记录</Link>:null}
      <div style={aStyle} data-id={record.id} onClick={this.editorNum.bind(this, record.noname)}>编辑</div>
      <div style={aStyle} data-id={record.id} onClick={this.deleteId.bind(this, record.noname)}>删除</div>
    </div>);
  };

  renderStatus = (value) => {
    return (<IceLabel inverse={false} status="default">
      {value}
    </IceLabel>);
  };

  changePage = (currentPage) => {
    this.queryCache.page = currentPage;
  };

  // onTabChange = (tabKey) => {
  //   const firstTabCatId = this.state.tabList.find((item) => {
  //     return item.type === tabKey;
  //   }).subCategories[0].id;
  //
  //   this.setState({
  //     currentTab: tabKey,
  //     currentCategory: firstTabCatId,
  //   });
  //   this.queryCache.catId = firstTabCatId;
  //   this.fetchData();
  // };
  //
  // onSubCategoryClick = (catId) => {
  //   this.setState({
  //     currentCategory: catId,
  //   });
  //   this.queryCache.catId = catId;
  //   this.fetchData();
  // };

  renderTabBarExtraContent = () => {
    return (<div style={styles.tabExtra}>
      <Search style={styles.search} type="secondary" placeholder="搜索" searchText="" onSearch={this.onSearch}/>
    </div>);
  };

  getIcon = (appicon) => {
    console.log(appicon);
    return (<img src={appicon} style={{
        width: '28px'
      }} className="media-side"/>)
  }

  //添加题目
  onChange(checked) {
    var that = this;
    const nameValue = that.props.name;
    console.log(checked)
    console.log(nameValue);
    this.setState({value: {}})
  }

  onError = (file) => {
    console.log('onError callback : ', file);
  }
  onError1 = (file) => {
    console.log('onError callback : ', file);
  }
  beforeUpload = (info) => {
    console.log('beforeUpload callback : ', info);
  }
  beforeUpload1 = (info) => {
    console.log('beforeUpload callback : ', info);
  }

  onSuccess = (res, file) => {
    console.log(res)
    Feedback.toast.success('上传成功');
    const logoImg = 'http://' + res.imgURL;
    this.setState({logoImg: logoImg});
  }
  onSuccess1 = (res, file) => {
    console.log(res)
    Feedback.toast.success('上传成功');
    const logoImg1 = 'http://' + res.imgURL;
    console.log(logoImg1);
    this.setState({logoImg1: logoImg1});
  }

  onFormChange = (value) => {
    // this.setState({value});
  };

  onDragOver = () => {
    console.log("dragover callback");
  }

  onDrop = (fileList) => {
    console.log("drop callback : ", fileList);
  }
  onFileChange = (file) => {
    // console.log(file.file.imgURL);
    const iconImg = 'https://lem.chanel.com.cn/' + file.file.imgURL;
    console.log(iconImg);

    // this.setState({
    //   iconImg
    // })
  }

  //添加表单
  addItem = () => {
    console.log(this.state.value.items);
    this.state.value.items.push({});
    this.setState({value: this.state.value});
  };

  formChange = value => {
    console.log('value', value);
    this.setState({value});
  };
  changeItem = () => {
    let items = this.state.value.items;
    items[0].aaa = '有趣';
    this.setState({
      value: {
        ...this.state.value,
        items: items
      }
    });
  };
  removeItem = (index) => {
    this.state.value.items.splice(index, 1);
    this.setState({value: this.state.value});
  }

  validateAllFormField = () => {
    this.refs.form.validateAll((errors, values) => {
      console.log('errors', errors, 'values', values);
    });
  };

  reset = () => {
    this.setState({
      value: {
        title: '',
        resolve: '',
        sort: '',
        'status': false,

        items: [
          {
            name: '',
            judge: ''
          }
        ]
      },

      logoImg: '',
      logoImg1: ''
    });
  };
  onTabChange(key) {
    this.reset();
    this.setState({currentKey: key, btnword: '立即创建', ajaxUrl: 'api.php?entry=sys&c=column&a=subjects&do=insert'});
    console.log('切换tab顺序');
  }
  submit = () => {
    console.log(this.state)
    const that = this;
    // console.log(that.formRef);
    that.formRef.validateAll((error, value) => {
      // console.log('error', error, 'value', value);
      if (error) {
        // 处理表单报错
      }
      // 提交当前填写的数据

      console.log(that.formRef.props.value);

      const dataAry = {
        ...that.formRef.props.value,
        logoImg: that.state.logoImg,
        logoImg1: that.state.logoImg1,
        cid: this.props.history.params.id,
        id: this.state.problem
          ? this.state.problem
          : null
      }
      console.log(that.formRef.props.value);
      console.log(dataAry)
      console.log(this.props.history.params)

      // 修改区
      // const newrequestUrl = this.props.history.params.id >0
      //   ? 'api.php?entry=sys&c=column&a=subjects&do=insert'
      //   : 'api.php?entry=sys&c=column&a=subjects&do=updata';
      // console.log(newrequestUrl);
      const newrequestUrl = that.state.ajaxUrl;

      console.log(newrequestUrl)
      const result = ajaxTo(newrequestUrl, dataAry);
      result.then(function(res) {
        // 这是成功请求返回的数据
        Feedback.toast.success(res.message);
        // setTimeout(function() {
        //    that.props.history.router.push('/activityList');
        // }, 2000);
        console.log(res)
      }, function(value) {
        // 这是错误请求返回的信息
      })

    });
    setTimeout(function() {
      // that.props.history.router.push('/activityList');
      const result = ajaxTo('api.php?entry=sys&c=column&a=subjects&do=display', {cid: that.props.history.params.id});
      result.then(function(res) {
        console.log(res.data)

        that.setState({allData: res.data});
      })
      that.setState({currentKey: '1'})

      //重置表单
      that.setState({
        value: {
          title: '',
          resolve: '',
          sort: '',
          'status': false,

          items: [
            {
              name: '',
              judge: ''
            }
          ]
        },

        logoImg: '',
        logoImg1: ''
      });
    }, 2000);

  };

  render() {
    const init = this.field.init;
    const defultClass = this.state.getAllClass;
    var selclass = [

      {
        label: "单选",
        value: 'radio'
      }, {
        label: "多选",
        value: 'checkbox'
      }

    ]
    var allClassL = [
      {
        label: "图片",
        value: 0
      }, {
        label: "文字",
        value: 1
      }, {
        label: "多图片",
        value: 2
      }
    ];
    const styleP = {
      paddingBottom: '25px'
    }
    // if (this.state.getAllClass) {
    //
    //   var allClassL = [];
    //   const allClass = this.state.getAllClass.map((item, i) => {
    //     return allClassL.push({label: item.classtitle, value: item.id})
    //   })
    // }

    let forData = this.state.allData;
    const arr = [];
    var titleName = '';
    if (forData) {
      if (forData.length != 0) {
        titleName = forData[0].columnTitle;
      }

      for (var i = 0; i < forData.length; i++) {

        arr.push({
          'subtitle': forData[i].title,
          'id':forData[i].id,
          // 'publishTime': forData[i].createtime,
          'noname': forData[i].id,
          'subsort': forData[i].sort,
          'substatus': forData[i].status == '1'
            ? '开启'
            : '关闭',

          // 'bannericon': forData[i].bannericon,
          // 'typename': forData[i].typename,
          // 'icon': forData[i].icon,
          // 'icons': forData[i].icons
        })
      }
    }
    const tableData = {
      'currentPage': 1,
      'pageSize': 8,
      'data': arr
    }

    const {tabList} = this.state;
    return (<div className="create-activity-form">
      <IceContainer title={titleName
          ? titleName
          : null} style={styles.container}>
        <Tab activeKey={this.state.currentKey} onChange={this.onTabChange.bind(this)}>
          <TabPane tab="题库管理" key="1">
            <div className="complex-tab-table">
              <IceContainer>
                <Table dataSource={tableData.data} isLoading={tableData.__loading} className="basic-table" style={styles.basicTable} hasBorder={false} onRowClick={onRowClick}>
                  <Table.Column title="编号" width={120} dataIndex="noname"/>
                  <Table.Column title="题目" width={120} dataIndex="subtitle"/>
                  <Table.Column title="排序" width={120} dataIndex="subsort"/>
                  <Table.Column title="状态" dataIndex="substatus" width={85} cell={this.renderStatus}/>
                  <Table.Column title="操作" dataIndex="operation" width={150} cell={this.renderOperations}/>
                </Table>

              </IceContainer>
            </div>
          </TabPane>

          <TabPane tab="添加题目" key="2">
            <IceFormBinderWrapper value={this.state.value} onChange={this.onFormChange} ref={(formRef) => {
                this.formRef = formRef;
              }}>
              <div>
                <Row style={styles.formItem}>
                  <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                    题目：
                  </Col>

                  <Col s="12" l="10">
                    <IceFormBinder name="title">
                      <Input style={{
                          width: '100%'
                        }}/>
                    </IceFormBinder>
                    <IceFormError name="title"/>
                  </Col>
                </Row>

                <Row style={styles.formItem}>
                  <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                    题目类型：
                  </Col>
                  <Col s="12" l="10">
                    <IceFormBinder name="type">
                      <Select className="next-form-text-align" dataSource={allClassL}/>
                    </IceFormBinder>
                  </Col>
                </Row>

                <Row style={styles.formItem}>
                  <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                    单选/多选：
                  </Col>
                  <Col s="12" l="10">
                    <IceFormBinder name="sel_type">
                      <Select className="next-form-text-align" dataSource={selclass}/>
                    </IceFormBinder>
                  </Col>
                </Row>

                {/* <Row style={styles.formItem}>
                  <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                    分值：
                  </Col>

                  <Col s="12" l="10">
                    <IceFormBinder name="num">
                      <Input style={{
                          width: '100%'
                        }}/>
                    </IceFormBinder>
                    <IceFormError name="num"/>
                  </Col>
                </Row> */
                }

                <ArticleList items={this.state.value.items} addItem={this.addItem} removeItem={this.removeItem} validateAllFormField={this.validateAllFormField}/>

                <Row style={styles.formItem2}>
                  <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                    排序：
                  </Col>

                  <Col s="12" l="10">
                    <IceFormBinder name="sort">
                      <Input style={{
                          width: '100%'
                        }}/>
                    </IceFormBinder>
                    <IceFormError name="title"/>
                  </Col>
                </Row>

                <Row style={styles.formItem}>
                  <Col xxs="6" s="2" l="2" style={styles.formLabel}>
                    状态：
                  </Col>

                  <Col s="12" l="10">
                    <IceFormBinder name='status'>
                      <SwitchForForm defaultChecked={false}/>
                    </IceFormBinder>
                  </Col>
                </Row>

                {/* <Row className="bannerstatus"  style={{
                  marginTop: '2rem',
                  marginLeft: '12px'
                }}>
              <Col xxs="1" s="3" l="3" style={{display: 'inline-block',marginTop: '5px'}}>
                Banner状态：
              </Col>
              <Col s="12" l="1">
                <IceFormBinder name='bannerstatus'>
                  <SwitchForForm defaultChecked={false}/>
                </IceFormBinder>
              </Col>
              </Row> */
                }
                {/* <Row style={styles.formItem}>
                  <Col xxs="1" s="1" l="2" style={styles.formLabel}>
                    状态：
                  </Col>
                  <Col s="1" l="3">
                    <IceFormBinder name="status">
                      <SwitchForForm defaultChecked={false}/>
                    </IceFormBinder>
                  </Col>
                </Row> */
                }

                <Button style={{
                    marginLeft: '10px',
                    marginTop: '2rem'
                  }} type="primary" onClick={this.submit}>
                  {this.state.btnword}
                </Button>
                <Button style={{
                    marginLeft: '10px',
                    marginTop: '2rem'
                  }} onClick={this.reset}>
                  重置
                </Button>
              </div>
            </IceFormBinderWrapper>
          </TabPane>
          }
        </Tab>

      </IceContainer>
    </div>); } } class ArticleList extends Component {


      render() {
        const letter = [
          'A',
          'B',
          'C',
          'D',
          'E',
          'F',
          'G',
          'H',
          'I',
          'J',
          'K',
          'L',
          'M',
          'N',
          'O',
          'P',
          'Q',
          'R',
          'S',
          'T',
          'U',
          'V',
          'W',
          'X',
          'Y',
          'Z'
        ];
        return (<div style={{
            marginTop: 10
          }}>
          <Button type='primary' style={{
              margin: 10
            }} onClick={this.props.addItem}>添加选项</Button>
          {/* <Button style={{marginLeft: 10}} onClick={this.props.validateAllFormField}>
          校验整个表单
        </Button> */
          }

          {
            this.props.items
              ? this.props.items.map((item, index) => {
                return (<Row key={index} style={{
                    marginTop: 5,
                    marginLeft: '-8px'
                  }}>
                  {/* <Col>
                  <span style={{
                      marginLeft: '3.4rem'
                    }}>产品图片链接：</span>
                  <IceFormBinder>
                    <Input name={`items[${index}].name`} placeholder=""/>
                  </IceFormBinder>
                  <div><IceFormError name={`items[${index}].name`}/></div>
                </Col> */
                  }
                  <Col>
                    <span style={{
                        marginLeft: '3.4rem'
                      }}>选项{letter[index]}/图片地址：</span>
                    <IceFormBinder name={`items[${index}].judge`}>
                      <Input name={`items[${index}].judge`} placeholder=""/>
                    </IceFormBinder>
                    <div><IceFormError name={`items[${index}].judge`}/></div>
                  </Col>

                  <Col>
                    <span style={{
                        display: 'inlineblock',
                        height: '30px',
                        marginLeft: '3.4rem',
                        lineHeight: "10px"
                      }}>正误：</span>
                    <IceFormBinder name={`items[${index}].status`}>
                      <SwitchForForm defaultChecked={false}/>
                    </IceFormBinder>
                    <div><IceFormError name={`items[${index}].status`}/></div>
                  </Col>

                  {/* <Col xxs="6" s="2" l="1" style={{display: 'inline-block',marginTop: '5px'}}>
                  正误：
                </Col>
                <Col s="12" l="4">
                  <IceFormBinder name={`items[${index}].judge`}>
                    <SwitchForForm defaultChecked={false} dataid={index}/>
                  </IceFormBinder>
                </Col> */
                  }

                  <Col>
                    <Button onClick={this.props.removeItem.bind(this, index)}>删除</Button>
                  </Col>

                </Row>);
              })
              : null
          }
        </div>);
      }
    }

    const styles = {
      container: {
        paddingBottom: 0
      },
      formItem: {
        height: '28px',
        lineHeight: '28px',
        marginBottom: '25px'
      },
      formLabel: {
        textAlign: 'right'
      },
      formItem2: {
        height: '28px',
        lineHeight: '28px',
        marginBottom: '25px',
        marginTop: '25px'
      },
      btns: {
        margin: '25px 0'
      },
      resetBtn: {
        marginLeft: '20px'
      }
    };
