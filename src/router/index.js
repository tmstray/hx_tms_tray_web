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
var router = new Router({
    routes: staticRotes.concat(routesMap)
})

router.beforeEach((to,from,next)=>{
    if(to.path === '/login' || to.path ==='/'){
        next()
    }else{
        let token = localStorage.getItem('token')
        if(token == null || token === ''){
        next('/login')
        }else{
        next()
        }
    }
})



// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }


export default router
