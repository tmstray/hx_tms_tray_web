// layOut
import Layout from '@/pages/layout/index'
/* 订单管理 */
// const Order = () => import('@/pages/order-manage')
// const OrderList = () => import('@/pages/order-manage/order-list')
// // const ProductManage = () => import('@/pages/order-manage/product-manage')
// const ProductionList = () => import('@/pages/order-manage/product-manage/production-list')
// const ReviewManage = () => import('@/pages/order-manage/product-manage/review-manage')
// const ReturnGoods = () => import('@/pages/order-manage/return-goods')

// /* 产品管理 */
// // const Goods = () => import('@/pages/goods-manage')
// const GoodsList = () => import('@/pages/goods-manage/goods-list')
// const GoodsClassify = () => import('@/pages/goods-manage/goods-classify')
// // 权限管理
// // const Permission = () => import('@/pages/permission')
// const UserManage = () => import('@/pages/permission/user-manage')
// const RoleManage = () => import('@/pages/permission/role-manage')
// const MenuManage = () => import('@/pages/permission/menu-manage')

/* 需要权限判断的路由 */
// const dynamicRoutes = [
//     {
//         path: '/dynamicRoutes',
//         component: Layout,
//         name: 'Layout',
//         children: [{
//             path: '/order/list',
//             component: OrderList,
//             name: 'order-list',
//             meta: {
//                 name: '订单管理/订单列表'
//             }
//         },
//         {
//             path: '/order/product/list',
//             component: ProductionList,
//             name: 'product-list',
//             meta: {
//                 name: '订单管理/生产管理/生产列表'
//             }
//         },
//         {
//             path: '/order/product/review',
//             component: ReviewManage,
//             name: 'review-manage',
//             meta: {
//                 name: '订单管理/生产管理/审核管理'
//             }
//         },
//         {
//             path: '/order/returnGoods',
//             component: ReturnGoods,
//             name: 'return-goods',
//             meta: {
//                 name: '订单管理/退货管理'
//             }
//         },
//         {
//             path: '/goods/list',
//             component: GoodsList,
//             name: 'goods-list',
//             meta: {
//                 name: '产品管理/产品列表'
//             }
//         },
//         {
//             path: '/goods/classify',
//             component: GoodsClassify,
//             name: 'goods-classify',
//             meta: {
//                 name: '产品管理/产品分类'
//             }
//         },
//         {
//             path: '/permission/user',
//             component: UserManage,
//             name: 'user-manage',
//             meta: {
//                 name: '权限管理/用户管理'
//             }
//         },
//         {
//             path: '/permission/role',
//             component: RoleManage,
//             name: 'role-manage',
//             meta: {
//                 name: '权限管理/角色管理'
//             }
//         },
//         {
//             path: '/permission/menu',
//             component: MenuManage,
//             name: 'menu-manage',
//             meta: {
//                 name: '权限管理/'
//             }
//         }]
//     }
// ]
const dynamicRoutes = [{
    path: '/dynamicRoutes',
    component: Layout,
    name: 'Layout',
    children: [
        {
            path: '/productReport/trayManage',
            component: () => import('@/pages/trayManage/index'),
            name: 'trayManage',
            meta: {
                name: '托盘管理报表'
            }
        },
        {
            path: '/productReport/stockView',
            component: () => import('@/pages/stockView/index'),
            name: 'stockView',
            meta: {
                name: '库存显示报表'
            }
        },
        {
            path: '/product/home',
            component: () => import('@/pages/home/index'),
            name: 'home',
            meta: {
                name: '水泥生产工控页面'
            }
        },
        {
            path: '/product/fullTrayManage',
            component: () => import('@/pages/fullTrayManage/index'),
            name: 'fullTrayManage',
            meta: {
                name: '满托库存清单'
            }
        },
        {
            path: '/product/emptyTrayManage',
            component: () => import('@/pages/emptyTrayManage/index'),
            name: 'emptyTrayManage',
            meta: {
                name: '空托库存清单'
            }
        }
    ]
}]
export default dynamicRoutes
