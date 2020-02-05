export default [
    {
        path: '/serviceNavigation',
        name: 'ServiceNavigation',
        component: () => import('@/views/personnel/ServiceNavigation'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/personnelList',
        name: 'PersonnelList',
        component: () => import('@/views/personnel/PersonnelList'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/personnelProfile',
        name: 'PersonnelProfile',
        component: () => import('@/views/personnel/PersonalProfile'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/personnelForm',
        name: 'PersonnelForm',
        component: () => import('@/views/personnel/profile/PersonnelForm'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/personnelCenterConfigForm',
        name: 'PersonnelCenterConfigForm',
        component: () => import('@/views/personnel/config/PersonnelCenterConfigForm'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/personnelCenterConfigList',
        name: 'PersonnelCenterConfigList',
        component: () => import('@/views/personnel/config/PersonnelCenterConfigList'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/personnelJobManageForm',
        name: 'PersonnelJobManageForm',
        component: () => import('@/views/personnel/PersonnelJobManageForm'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/personnelJobManageList',
        name: 'PersonnelJobManageList',
        component: () => import('@/views/personnel/PersonnelJobManageList'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/personnelStatistics',
        name: 'PersonnelStatistics',
        component: () => import('@/views/personnel/PersonnelStatistics'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/personnelAddressBookList',
        name: 'PersonnelAddressBookList',
        component: () => import('@/views/personnel/PersonnelAddressBookList'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/personnelAddressBookForm',
        name: 'PersonnelAddressBookForm',
        component: () => import('@/views/personnel/PersonnelAddressBookForm'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/personnelsAddressBookForm',
        name: 'PersonnelsAddressBookForm',
        component: () => import('@/views/personnel/PersonnelsAddressBookForm'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/personnelAnnualAssessment',
        name: 'PersonnelAnnualAssessment',
        component: () => import('@/views/personnel/profile/PersonnelAnnualAssessment'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/personnelRotationJobManageList',
        name: 'PersonnelRotationJobManageList',
        component: () => import('@/views/personnel/PersonnelRotationJobManageList'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/personnelLeaveList',
        name: 'PersonnelLeaveList',
        component: () => import('@/views/personnel/PersonnelLeaveList'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/fhPersonnelList',
        name: 'FhPersonnelList',
        component: () => import('@/views/personnel/FhPersonnelList'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/fhPersonnelJobManageList',
        name: 'FhPersonnelJobManageList',
        component: () => import('@/views/personnel/FhPersonnelJobManageList'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/fhPersonnelAddressBookList',
        name: 'FhPersonnelAddressBookList',
        component: () => import('@/views/personnel/FhPersonnelAddressBookList'),
        meta: {
            keepAlive: true
        }
    },
]