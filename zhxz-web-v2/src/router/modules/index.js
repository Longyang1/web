const files = require.context('.', true, /\.js$/)

console.log(files.keys()) // ["./home.js"] 返回一个数组
let configRouters = []
files.keys().forEach(key => {
    if (key === './index.js') return
    configRouters = configRouters.concat(files(key).default) // 读取出文件中的default模块
})
let routers = [
    {
        path: '/',
        redirect: to => {
            return '/home';
        },
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/Home'),
        children: configRouters.concat([{
                path: '/workSpace',
                name: 'SystemHome',
                component: () => import('@/views/workSpace/SystemHome'),
                meta: {
                    keepAlive: true
                }
            }
        ])
    },
    {
        path: '/meeting/:meetingId',
        name: 'Meeting',
        component: () => import('@/views/meeting/Meeting')
    },
]
export default routers // 抛出一个Vue-router期待的结构的数组