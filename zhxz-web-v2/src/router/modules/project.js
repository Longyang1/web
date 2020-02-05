export default [
    {
        path: '/projectInfoList',
        name: 'ProjectInfoList',
        component: () => import('@/views/project/ProjectInfoList'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/projectInfoForm',
        name: 'ProjectInfoForm',
        component: () => import('@/views/project/ProjectInfoForm'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/projectInfoListSelf',
        name: 'ProjectInfoListSelf',
        component: () => import('@/views/project/ProjectInfoListSelf'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/myProjectInfoSpace',
        name: 'MyProjectInfoSpace',
        component: () => import('@/views/project/MyProjectInfoSpace'),
        meta: {
            keepAlive: true
        }
    },
]