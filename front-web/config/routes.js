export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: false,
    icon: 'smile',
    component: './Welcome',
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    name: '拓扑编辑器',
    icon: 'smile',
    path: '/editorkoni',
    component: './EditorKoni',
  },
  {
    name: '基础详情页',
    icon: 'smile',
    path: '/profilebasic',
    component: './ProfileBasic',
  },
  {
    component: './404',
  },
];
