export default [
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
    path: '/detail',
    name: false,
    icon: 'smile',
    component: './charts'
  },
  {
    path: '/detail/:id.html',
    name: false,
    icon: 'smile',
    component: './charts'
  },
  {
    component: './404',
  },
];
