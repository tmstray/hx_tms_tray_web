export default {
    get UserToken() {
        return localStorage.getItem('token')
    },
    set UserToken(value) {
        localStorage.setItem('token', value)
    },
    /* 导航菜单是否折叠 */
    isSidebarNavCollapse: false,
    /* 面包屑导航列表 */
    crumbList: [],
    /* 左侧菜单栏 */
    sidebarMenu: [
        {
            path: '/product',
            name: 'product',
            meta: {
                icon: 'el-icon-thumb',
                name: '生产界面'
            },
            children: [
                {
                    path: 'home',
                    name: 'home',
                    meta: {
                        name: '水泥生产工控页面'
                    }
                },
                {
                    path: 'fullTrayManage',
                    name: 'fullTrayManage',
                    meta: {
                        name: '满托库存清单'
                    }
                },
                {
                    path: 'emptyTrayManage',
                    name: 'emptyTrayManage',
                    meta: {
                        name: '空托库存清单'
                    }
                }
            ]
        },
        {
            path: '/productReport',
            name: 'productReport',
            meta: {
                icon: 'el-icon-thumb',
                name: '生产报表'
            },
            children: [
                {
                    path: 'trayManage',
                    name: 'trayManage',
                    meta: {
                        name: '托盘管理报表'
                    }
                },
                {
                    path: 'stockView',
                    name: 'stockView',
                    meta: {
                        name: '库存显示报表'
                    }
                }
            ]
        },
        {
            path: '/systemManager',
            name: 'systemManager',
            meta: {
                icon: 'el-icon-thumb',
                name: '系统管理'
            },
            children: [
                {
                    path: 'user',
                    name: 'user',
                    meta: {
                        name: '用户管理'
                    }
                },
                {
                    path: 'role',
                    name: 'role',
                    meta: {
                        name: '角色管理'
                    }
                },
                {
                    path: 'menu',
                    name: 'menu',
                    meta: {
                        name: '菜单管理'
                    }
                }
            ]
        }
    ]
}
