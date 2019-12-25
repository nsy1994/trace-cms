export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // content
      { path: '/', redirect: '/content/report' },
      {
        path: '/content',
        name: 'content',
        icon: 'file-text',
        routes: [
          {
            path: '/content/report',
            name: 'report',
            component: './Report',
          },
          {
            path: '/content/confirm',
            name: 'confirm',
            component: './Confirm',
          },
          {
            path: '/content/userCenter',
            name: 'userCenter',
            component: './UserCenter',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
