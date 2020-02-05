let commonRouters = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/EmcLogin')
  },
  {
    path: '/toHome',
    name: 'LoginCheckOut',
    component: () => import('@/views/LoginCheckOut')
  },
]
export default commonRouters;