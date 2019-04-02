import cookie from 'react-cookies';
// <!-- auto generated navs start -->
const autoGenHeaderNavs = [];
const autoGenAsideNavs = [

];

// <!-- auto generated navs end -->

const customHeaderNavs = [
  {
    text: '首页',
    to: '/',
    icon: 'home',
  }
];

const customAsideNavs = [
  {
    name:'home',
    text: '首页',
    to: '/Home',
    icon: 'home'
  },
  {
    name:'rolelistpage',
    text: '权限设置',
    to: '/rolelistpage',
    icon: 'repair'
  },
  {
    name:'administrators',
    text: '教师管理',
    to: '/administratorslist',
    icon: 'repair'
  },
  // {
  //   name:'registermanage',
  //   text: '签到二维码生成',
  //   to: '/registermanage',
  //   icon: 'repair'
  // },
  // {
  //   name:'testcode',
  //   text: '现场考试二维码生成',
  //   to: '/testcode',
  //   icon: 'repair'
  // },

  {
    name:'fenzuguanli',
    text: '阶段培训管理',
    icon: 'shop',
    children: [
      {
        name:'fenzuguanli1',
        text: '阶段一',
        to: '/stageonelist',
      },
      {
        name:'fenzuguanli2',
        text: '过渡期',
        to: '/transcationlist'
      },
      {
        name:'fenzuguanli3',
        text: '阶段二',
        to: '/stagetwolist'
      },
    ]
  },
  {
    name:'jieduanguanli',
    text: '阶段内容更改',
    icon: 'shop',
    children: [
      {name:'jieduanguanli1',
        text: '新建阶段',
        to: '/topicmanage/create',
      },
      {
        name:'jieduanguanli2',
        text: '阶段列表',
        to: '/topicmanagelist'
      },

    ]
  },
  {
    name:'zhutiguanli',
    text: '主题内容更改',
    to: '/activity',
    icon: 'shop',
    children: [
      {
        name:'zhutiguanli1',
        text: '主题添加',
        to: '/activity/create',
      },
      {
        name:'zhutiguanli2',
        text: '主题列表',
        to: '/activityList'
      }
    ]
  },
{
  name:'buzhouguanli',
  text: '步骤内容更改',
  to: '/column',
  icon: 'ol-list',
  children: [
    {
      name:'buzhouguanli1',
      text: '内容添加',
      to: '/column/columncreate'
    },
    {
      name:'buzhouguanli2',
      text: '内容列表',
      to: '/columnList'
    }
  ]
},


  {
    name:'yonghuguanli',
    text: '用户管理',
    to: '/usersetting',
    icon: 'yonghu'
  },
  {
    name:'tongji',
    text: '统计记录',
    to: '/record', 
    icon: 'ol-list',
    children: [
      {
        name:'record',
        text: '每日统计',
        to: '/recordid'
      },
      {
        name:'recordTransaction',
        text:'过渡期统计',
        to:'/recordTransaction'
      },
      {
        name:'statistics',
        text: '阶段测试统计',
        to: '/statistics/0'
      }
    ]
  },
  {
    name:'lizhiliebiao',
    text: '离职列表',
    to: '/leavelist',
    icon: 'yonghu'
  },

  {
    name:'xitongshezhi',
    text: '系统设置',
    to: '/setting',
    icon: 'shezhi',
    children: [
      {
        text: '基本设置',
        to: '/setting',
      },

    ],
  },
];

function transform(navs) {
  // const userInfo = cookie.load('userInfo');
  // console.log(userInfo);
  //
  //
  // // custom logical
  return [...navs];
}
// console.log(autoGenHeaderNavs);
export const headerNavs = transform([
  ...autoGenHeaderNavs,
  ...customHeaderNavs,
]);


export const asideNavs = transform([...autoGenAsideNavs, ...customAsideNavs]);
