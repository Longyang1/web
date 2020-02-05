export default [
    {
        path: '/msg',
        name: 'Msg',
        component: () => import('@/views/msg/Msg'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/sysMsgForm',
        name: 'SysMsgForm',
        component: () => import('@/views/msg/SysMsgForm'),
        meta: {
            keepAlive: true,
            text: '消息信息',
            icon: 'fa-commenting'
        }
    },
]