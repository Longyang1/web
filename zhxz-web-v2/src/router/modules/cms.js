export default [
    {
        path: '/cmsSiteList',
        name: 'CmsSiteList',
        component: () => import('@/views/cms/CmsSiteList'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/cmsSiteForm',
        name: 'CmsSiteForm',
        component: () => import('@/views/cms/CmsSiteForm'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/cmsCategoryForm',
        name: 'CmsCategoryForm',
        component: () => import('@/views/cms/CmsCategoryForm'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/cmsCategoryList',
        name: 'CmsCategoryList',
        component: () => import('@/views/cms/CmsCategoryList'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/cmsArticleList',
        name: 'CmsArticleList',
        component: () => import('@/views/cms/CmsArticleList'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/cmsArticleForm',
        name: 'CmsArticleForm',
        component: () => import('@/views/cms/CmsArticleForm'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/articleViewList',
        name: 'ArticleViewList',
        component: () => import('@/views/cms/ArticleViewList'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/systemInformationManagement',
        name: 'SystemInformationManagement',
        component: () => import('@/views/cms/SystemInformationManagement'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/systemInformation',
        name: 'SystemInformation',
        component: () => import('@/views/cms/SystemInformation'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/xlkhNewsManagement',
        name: 'XlkhNewsManagement',
        component: () => import('@/views/cms/XlkhNewsManagement'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/xlkhNews',
        name: 'XlkhNews',
        component: () => import('@/views/cms/XlkhNews'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/noticeManagement',
        name: 'NoticeManagement',
        component: () => import('@/views/cms/NoticeManagement'),
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/notice',
        name: 'Notice',
        component: () => import('@/views/cms/Notice'),
        meta: {
            keepAlive: true
        }
    },
]