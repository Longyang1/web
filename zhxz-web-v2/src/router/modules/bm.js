export default [
    {
        path: '/bmCompanyInfoForm',
        name: 'BmCompanyInfoForm',
        component: () => import('@/views/bm/company/BmCompanyInfoForm'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/bmSupplierInfoList',
        name: 'BmSupplierInfoList',
        component: () => import('@/views/bm/company/BmSupplierInfoList'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/bmCustomerInfoList',
        name: 'BmCustomerInfoList',
        component: () => import('@/views/bm/company/BmCustomerInfoList'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/bmSupplierInfoSearch',
        name: 'BmSupplierInfoSearch',
        component: () => import('@/views/bm/company/BmSupplierInfoSearch'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/bmCustomerInfoSearch',
        name: 'BmCustomerInfoSearch',
        component: () => import('@/views/bm/company/BmCustomerInfoSearch'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/contractInfoList',
        name: 'BmContractInfoList',
        component: () => import('@/views/bm/contract/BmContractInfoList'),
        meta: {
            keepAlive: true
        }
    },{
        path: '/contractInfoForm',
        name: 'BmContractInfoForm',
        component: () => import('@/views/bm/contract/BmContractInfoForm'),
        meta: {
            keepAlive: true
        }
    },{
        path: '/chooseSupplierInfoList',
        name: 'ChooseSupplierInfoList',
        component: () => import('@/views/bm/contract/ChooseSupplierInfoList'),
        meta: {
            keepAlive: true
        }
    }

]