export default [
    {
        path: '/fileManage',
        name: 'FileManage',
        component: () => import('@/views/file/FileManage'),
        meta: {
            keepAlive: true
        }
    },
]