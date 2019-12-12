import Vue from 'vue'
import App from '@/App'
import store from '@/store/index'
import router from '@/router/index'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.scss'

import axios from './config/httpConfig'
import * as globalFilter from './filters/filters'
import '@/icons'

Vue.prototype.$http = axios

for (var key in globalFilter) {
    Vue.filter(key, globalFilter[key])
}

Vue.use(ElementUI)

Vue.config.productionTip = false
console.log('router', router)
// router.beforeEach((to, from, next) => {
//     if (!store.state.UserToken) {
//         if (to.matched.length > 0 && !to.matched.some(record => record.meta.requiresAuth)) {
//             next()
//         } else {
//             next({ path: '/login' })
//         }
//     } else {
//         if (!store.state.permission.permissionList) {
//             console.log('path', to.path)

//             // store.dispatch('permission/FETCH_PERMISSION').then(() => {
//             //     next({ path: to.path })
//             // })
//         } else {
//             if (to.path !== '/login') {
//                 next()
//             } else {
//                 next(from.fullPath)
//             }
//         }
//     }
// })

router.afterEach((to, from, next) => {
    var routerList = to.matched
    console.log('matched', to.matched)
    if (routerList[0].path === '/login') {
        return
    }
    store.commit('setCrumbList', routerList)
    // store.commit('permission/SET_CURRENT_MENU', to.name)
})

/* eslint-disable no-new */
console.log('router', router)
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
