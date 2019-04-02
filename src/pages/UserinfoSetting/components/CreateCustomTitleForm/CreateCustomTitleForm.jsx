import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {ajaxTo} from '../../../../util/util';
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
export default class CreateCustomTitleForm extends Component {
  field = new Field(this);
  static displayName = 'CreateCustomTitleForm';

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
      btnword:'立即创建',
      // starttime: "2017-02-14",
      // endtime: "2017-03-24",
      getAllClass: "",
      currentKey: '1',
      //控制翻页
      isMobile: false,
      currentTab: 'solved',
      currentCategory: '1',
      ajaxUrl:'api.php?entry=sys&c=column&a=subject&do=insert',
      dataSource:[
          {label:'数字', value:'1'},
          {label:'文本', value:'2'},
          {label:'图片', value:'3'},
          {label:'手机号',value:'4'}
      ],
      dataSource1:[
          {label:'是', value:'1'},
          {label:'否', value:'0'},

      ]
    };
  }
  //获取题库列表
  // componentWillMount(){
  //   console.log(this.props.history.params.id)
  //   const that=this;
  //   // const result = ajaxTo('api.php?entry=sys&c=column&a=subject&do=display',{cid:this.props.history.params.id});
  //   // result.then(function(res){
  //   //   console.log(res.data)
  //   //
  //   //   that.setState({
  //   //     allData:res.data
  //   //   });
  //   // })
  //   //
  //   console.log(this.props.history.params.cid);
  //   if(this.props.history.params.cid!=='create'){
  //     ajaxTo('api.php?entry=sys&c=column&a=subject&do=edit',{id:this.props.history.params.cid})
  //     .then(function(res){
  //       console.log(res);
  //       that.setState({
  //         description:res.data.content,
  //         value: {
  //           bannerstatus:res.data.isread=="0"?false:true,
  //           title:res.data.title,
  //           sort: res.data.sort,
  //           // long:res.data.long=="1"?"开启":"关闭",
  //           'status': res.data.status=="1"?true:false,
  //           items:res.data.content
  //         },
  //         logoImg:res.data.banner,
  //         logoImg1:res.data.picture,
  //         btnword:'保存',
  //         ajaxUrl:'api.php?entry=sys&c=column&a=subject&do=update'
  //       })
  //     })
  //   }
  // }
//题库

//添加题目
  onChange(checked) {
    var that = this;
    const nameValue = that.props.name;
    console.log(checked)
    console.log(nameValue);
    this.setState({value: {}})
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
        sort:'',
        'status':false,

        items: [{
          name:'',
          judge:''
        }]
      },

      logoImg: '',
      logoImg1: ''
    });
  };
  onTabChange(key) {

  }
  renderForm=(appname)=>{
    return  <Input value={appname} disabled/>
  }
  renderSort=(sort)=>{
    return  <Input value={sort} disabled/>
  }
  renderDetail=(detail)=>{
    return  <Input value={detail} disabled/>
  }
  //表单标题
  renderStatus = (value) => {
    return (
      <IceLabel inverse={false} status="default">
        {value}
      </IceLabel>
    );
  };
  renderSelect=(class1)=>{
    if(class1=="文本"){
      return <Select dataSource={this.state.dataSource}  value="2" disabled/>;
    }else if(class1=="手机号"){
      return <Select dataSource={this.state.dataSource}  value="4" disabled/>;
    }
  }
  renderSure=(sure1)=>{
    console.log(sure1)
    // return <Select dataSource={this.state.dataSource1}  value="0" disabled/>
    return <Select dataSource={this.state.dataSource1} value="1"   disabled/>;
  }
  renderOperations = (value, index, record) => {
    // const toUrl = '/activity/'+record.id;
    // return (
    //   <div style={styles.complexTabTableOperation}>
    //     <Link to={toUrl}>编辑</Link>
    //     <div style={aStyle} data-id={record.id} onClick={this.deleteId.bind(this,record.id)}>删除</div>
    //   </div>
    // );
  };
  //
  getIcon = (appicon) => {
    console.log(appicon);
    return (
      <img src={appicon} style={{width:'28px'}} className="media-side" />
    )
  }
  submit = () => {
    console.log(this.state)
    console.log(this.props)
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
        id:this.props.history.params.cid=="create"?null:this.props.history.params.cid
      }
      console.log(that.formRef.props.value);
      console.log(dataAry)
      console.log(this.props.history.params)

      // 修改区
      // const newrequestUrl = this.props.history.params.id >0
      //   ? 'api.php?entry=sys&c=column&a=subject&do=insert'
      //   : 'api.php?entry=sys&c=column&a=subject&do=updata';
      // console.log(newrequestUrl);
      const newrequestUrl=that.state.ajaxUrl;
      const tableData = {
        'currentPage':1,
        'pageSize':8,
        'data':arr
      }
      console.log(newrequestUrl)
      const result = ajaxTo(newrequestUrl, dataAry);
      result.then(function(res) {
        console.log(res)
        // 这是成功请求返回的数据
        Feedback.toast.success(res.message);
        // setTimeout(function() {
        //   // that.props.history.router.push('/activityList');
        // }, 2000);

        that.props.history.router.push('/columnclass/3/'+that.props.history.params.id);
      }, function(value) {
        // 这是错误请求返回的信息
      })

    });
    // setTimeout(function() {
    //   // that.props.history.router.push('/activityList');
    //   const result = ajaxTo('api.php?entry=sys&c=column&a=subject&do=display',{cid:that.props.history.params.id});
    //   result.then(function(res){
    //     console.log(res.data)
    //
    //     that.setState({
    //       allData:res.data
    //     });
    //   })
    //       that.setState({currentKey: '1'})
    //
    //       //重置表单
    //       that.setState({
    //         value: {
    //           title: '',
    //           resolve: '',
    //           sort:'',
    //           'status':false,
    //
    //           items: [{
    //             name:'',
    //             judge:''
    //           }]
    //         },
    //
    //         logoImg: '',
    //         logoImg1: ''
    //       });
    // }, 2000);

  };

  render() {
    const init = this.field.init;
    const defultClass = this.state.getAllClass;

    const styleP = {
      paddingBottom: '25px'
    }
    if (this.state.getAllClass) {
      var allClassL = [];
      const allClass = this.state.getAllClass.map((item, i) => {
        return allClassL.push({label: item.classtitle, value: item.id})
      })
    }

    let forData = [
      {
      appname:'姓名',
      class:'文本',
      sort:'100',
      detail:'请输入您的真实姓名',
      sure:'是'
      },
      {
      appname:'电话',
      class:'手机号',
      sort:'99',
      detail:'请输入您的手机号',
      sure:'是'
    },
    {
    appname:'支付宝账号',
    class:'文本',
    sort:'98',
    detail:'请输入您的支付宝账号',
    sure:'是'
    }
  ];
    var arr = [];
    if (forData) {
      for (var i = 0; i < forData.length; i++) {

        arr.push({
          'appname': forData[i].appname,
          // 'publishTime': forData[i].createtime,
          'class1': forData[i].class,
          'sort':forData[i].sort,
          'detail': forData[i].detail,
          'sure':forData[i].sure

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
      <IceContainer  style={styles.container}>

        <Tab activeKey={this.state.currentKey} onChange={this.onTabChange.bind(this)}>


          <TabPane tab="表单设置" key="1">
            <Table
              dataSource={tableData.data}
              isLoading={tableData.__loading}
              className="basic-table"
              style={styles.basicTable}
              hasBorder={false}
              // onRowClick={onRowClick}
            >
              <Table.Column
                title="字段名称"
                width={100}
                dataIndex="appname"
                cell={this.renderForm}
              />

              <Table.Column
                title="排序"
                dataIndex="sort"
                width={100}
                cell={this.renderSort}
              />
              <Table.Column
                title="类型"
                dataIndex="class1"
                width={100}
                cell={this.renderSelect}
              />
              <Table.Column
                title="描述"
                dataIndex="detail"
                width={100}
                cell={this.renderDetail}
              />
              <Table.Column
                title="必需项"
                dataIndex="sure"
                width={100}
                cell={this.renderSure}
              />
              <Table.Column
                title="操作"
                dataIndex="operation"
                width={100}
                cell={this.renderOperations}
              />
            </Table>
            <IceFormBinderWrapper value={this.state.value} onChange={this.onFormChange}  ref={(formRef) => {
                this.formRef = formRef;
              }}>

              <div>

                <div style={{
                    marginTop: 20
                  }}>
                  <ArticleList dataSource1={this.state.dataSource1} dataSource={this.state.dataSource} items={this.state.value.items} addItem={this.addItem} removeItem={this.removeItem} validateAllFormField={this.validateAllFormField}/>
                </div>


                <Button style={{marginLeft: '10px',marginTop: '2rem'}} type="primary" onClick={this.submit}>
                  提交
                </Button>
                <Button style={{marginLeft: '10px',marginTop: '2rem'}}  onClick={this.reset}>
                  重置
                </Button>
              </div>

            </IceFormBinderWrapper>
          </TabPane>


        </Tab>

      </IceContainer>
    </div>); }
  }

  class ArticleList extends Component {
    render() {
      return (<div style={{
          marginTop: 10
        }}>

        {/* <Button style={{marginLeft: 10}} onClick={this.props.validateAllFormField}>
        校验整个表单
      </Button> */
        }

        {
          this.props.items
          ?
          this.props.items.map((item, index) => {
            return (<Row key={index} style={{
                marginBottom: '10px',
                // marginLeft: '-8px'
              }}>
              <Col l="3" style={{
                textAlign: 'right',
                marginLeft: '12px'
              }}>
                <IceFormBinder>
                  <Input name={`items[${index}].name`} />
                </IceFormBinder>
                <div><IceFormError name={`items[${index}].name`}/></div>
              </Col>
              {/* <Col>
                <IceFormBinder name={`items[${index}].url`} type="url" required message="文章地址必填，并且是一个 url" >
                  <Input />
                </IceFormBinder>
                <div><IceFormError name={`items[${index}].url`} /></div>
              </Col> */
              }

              <Col xxs="6" s="2" l="1" style={{display: 'inline-block',marginTop: '5px'}}>

              </Col>
              <Col s="12" l="4">
                <IceFormBinder>
                  <Input name={`items[${index}].judge`} />
                </IceFormBinder>
                <div><IceFormError name={`items[${index}].judge`}/></div>
              </Col>

              <Col s="12" l="4">
                <IceFormBinder>
                  <Select dataSource={this.props.dataSource} name={`items[${index}].class1`}/>
                </IceFormBinder>
                <div><IceFormError name={`items[${index}].class1`}/></div>
              </Col>

              <Col s="12" l="4">
                <IceFormBinder>
                  <Input name={`items[${index}].detail1`} />
                </IceFormBinder>
                <div><IceFormError name={`items[${index}].detail1`}/></div>
              </Col>

              <Col s="12" l="4">
                <IceFormBinder>
                  <Select dataSource={this.props.dataSource1} name={`items[${index}].sure1`}/>
                </IceFormBinder>
                <div><IceFormError name={`items[${index}].sure1`}/></div>
              </Col>

              <Col>
                <Button onClick={this.props.removeItem.bind(this, index)}>删除</Button>
              </Col>

            </Row>);
          }):null
        }
        <Button type='primary' style={{
            margin: 10
          }} onClick={this.props.addItem}>添加自定义字段</Button>
      </div>);
    }
  }


    const styles = {
      complexTabTableOperation: {
        lineHeight: '28px'
      },
      titleWrapper: {
        display: 'flex',
        flexDirection: 'row'
      },
      title: {
        marginLeft: '10px',
        lineHeight: '20px'
      },
      operation: {
        marginRight: '12px',
        textDecoration: 'none'
      },
      tabExtra: {
        display: 'flex',
        alignItems: 'center'
      },
      search: {
        marginLeft: 10
      },
      tabCount: {
        marginLeft: '5px',
        color: '#3080FE'
      },
      pagination: {
        textAlign: 'right',
        paddingTop: '26px'
      }
    };
