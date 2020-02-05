export default [
    {
        path: '/meetingSubjectList',
        name: 'MeetingSubjectList',
        component: () => import('@/views/meeting/MeetingSubjectList'),
        meta: {
            keepAlive: true
        }
    },
    // {
    //     path: '/projectSubjectAdd',
    //     name: 'ProjectSubjectAdd',
    //     component: () => import('@/views/meeting/ProjectSubjectAdd'),
    //     meta: {
    //         keepAlive: true
    //     }
    // },
    {
        path: '/transactionSubjectAdd',
        name: 'TransactionSubjectAdd',
        component: () => import('@/views/meeting/TransactionSubjectAdd'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/confMemberList',
        name: 'ConfMemberList',
        component: () => import('@/views/meeting/ConfMemberList'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/confMemberAdd',
        name: 'ConfMemberAdd',
        component: () => import('@/views/meeting/ConfMemberAdd'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/confLinkageList',
        name: 'ConfLinkageList',
        component: () => import('@/views/meeting/ConfLinkageList'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/confLinkageAdd',
        name: 'ConfLinkageAdd',
        component: () => import('@/views/meeting/ConfLinkageAdd'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/meetingContentTemplateList',
        name: 'MeetingContentTemplateList',
        component: () => import('@/views/meeting/MeetingContentTemplateList'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/meetingContentTemplateForm',
        name: 'MeetingContentTemplateForm',
        component: () => import('@/views/meeting/MeetingContentTemplateForm'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/meetingPool',
        name: 'MeetingPool',
        component: () => import('@/views/meeting/MeetingPool'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/createMeeting',
        name: 'CreateMeeting',
        component: () => import('@/views/meeting/CreateMeeting'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/meetingList',
        name: 'MeetingList',
        component: () => import('@/views/meeting/MeetingList'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/meetingSubjectItemConfigList',
        name: 'MeetingSubjectItemConfigList',
        component: () => import('@/views/meeting/MeetingSubjectItemConfigList'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/meetingSubjectItemConfigForm',
        name: 'MeetingSubjectItemConfigForm',
        component: () => import('@/views/meeting/MeetingSubjectItemConfigForm'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/meetingSubjectForm',
        name: 'MeetingSubjectForm',
        component: () => import('@/views/meeting/MeetingSubjectForm'),
        meta: {
            keepAlive: true
        }
    },
]