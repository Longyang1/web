export default [
    {
        path: '/processManage',
        name: 'ProcessManage',
        component: () => import('@/views/workflow/ProcessManage'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/toProcessed',
        name: 'ToProcessed',
        component: () => import('@/views/workflow/ToProcessed'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/processed',
        name: 'Processed',
        component: () => import('@/views/workflow/Processed'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/isubmitted',
        name: 'Isubmitted',
        component: () => import('@/views/workflow/Isubmitted'),
        meta: {
            keepAlive: true
        }
    },
    
]