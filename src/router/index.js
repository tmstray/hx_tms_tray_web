import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/login/login'
import NotFound from '@/pages/errorPage/404'
import Forbidden from '@/pages/errorPage/403'
import Layout from '@/pages/layout/index'
// import Home from '@/pages/home/index'
import routesMap from './modules'
Vue.use(Router)

// 固定的路由
let staticRotes = [
    {
        path: '/login',
        component: Login
    }, {
        path: '/',
        component: Layout,
        name: 'container',
        redirect: '/product/home',
        meta: {
            requiresAuth: true
        }
        // children: [
        //     {
        //         id: 1,
        //         path: '/product/home',
        //         alias: '/home',
        //         component: Home,
        //         name: 'home',
        //         meta: {
        //             name: '水泥工控'
        //         }
        //     }
        // ]
    }, {
        path: '/403',
        component: Forbidden
    },
    {
        path: '*',
        component: NotFound
    }
]
/* 初始路由 */
console.log('routesMap', staticRotes.concat(routesMap))
var router = new Router({
    routes: staticRotes.concat(routesMap)
})
export default router
