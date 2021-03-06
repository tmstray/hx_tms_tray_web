/**
 * @desc tag页签信息2
 * @author lichenxi (2019-09-25)
 * @update --
 */
import http from '@/config/httpConfig.js'
const tagsView = {
    namespaced: true,
    state: {
        visitedViews: [],
        cachedViews: [],
        delIndex: '',
        menus:[],
        userId:"",
        userinfo:{

        },
        isclear:""
    },
    mutations: {
        ADD_VISITED_VIEW: (state, view) => {
            // 如果当前选择的菜单是已经添加进去的tab路由,但是因为该路由是带查询参数id的编辑页面，必须更新当前的查询参数id
            const reLoadTabIndex = state.visitedViews.findIndex(n => n.name === view.name)
            if (reLoadTabIndex > -1) {
                // state.visitedViews[reLoadTabIndex].params.id = view.params.id
                state.visitedViews[reLoadTabIndex].params = view.params
                state.visitedViews[reLoadTabIndex].query = view.query
                return
            }
            state.visitedViews.push(
                Object.assign({}, view, {
                    title: view.meta.title || '空菜单',
                    // paramsId: view.params.id ? view.params.id : '',
                    params: view.params,
                    myQuery: view.query
                })
            )
        },
        ADD_CACHED_VIEW: (state, view) => {
            if (state.cachedViews.includes(view.name)) return
            if (!view.meta.noCache) {
                state.cachedViews.push(view.name)
            }
        },

        DEL_VISITED_VIEW: (state, viewName) => {
            for (const [i, v] of state.visitedViews.entries()) {
                if (v.name === viewName) {
                    state.delIndex = i
                    state.visitedViews.splice(i, 1)
                    break
                }
            }
        },
        DEL_CACHED_VIEW: (state, viewName) => {
            for (const i of state.cachedViews) {
                if (i === viewName) {
                    const index = state.cachedViews.indexOf(i)
                    state.cachedViews.splice(index, 1)
                    break
                }
            }
        },

        DEL_OTHERS_VISITED_VIEWS: (state, view) => {
            for (const [i, v] of state.visitedViews.entries()) {
                if (v.path === view.path) {
                    state.visitedViews = state.visitedViews.slice(i, i + 1)
                    break
                }
            }
        },
        DEL_OTHERS_CACHED_VIEWS: (state, view) => {
            for (const i of state.cachedViews) {
                if (i === view.name) {
                    const index = state.cachedViews.indexOf(i)
                    state.cachedViews = state.cachedViews.slice(index, index + 1)
                    break
                }
            }
        },

        DEL_ALL_VISITED_VIEWS: state => {
            state.visitedViews = []
        },
        DEL_ALL_CACHED_VIEWS: state => {
            state.cachedViews = []
        },

        UPDATE_VISITED_VIEW: (state, view) => {
            for (let v of state.visitedViews) {
                if (v.path === view.path) {
                    v = Object.assign(v, view)
                    break
                }
            }
        },
        GET_ALL_MENUS:(state,payload)=>{
            state.menus = []
            for(let i=0;i<payload.length;i++){
                state.menus.push(payload[i])
            }
        },
        GEU_USER_ID:(state,payload)=>{
            state.userId = payload
        },
        REMOVE_VIEWS:(state)=>{
            state.visitedViews = []
        },
        REMOVE_MENUS:(state)=>{
            state.menus = []
        },
        GET_USER_INFO:(state,payload)=>{
            state.userinfo = payload
        },
        CLEAR_TIMER:(state)=>{
            window.clearInterval(state.isclear)
        }
    },
    actions: {
        addView(state, view) {
            state.dispatch('addVisitedView', view)
            state.dispatch('addCachedView', view)
        },
        addVisitedView({
            commit
        }, view) {
            commit('ADD_VISITED_VIEW', view)
        },
        addCachedView({
            commit
        }, view) {
            commit('ADD_CACHED_VIEW', view)
        },

        delView({
            dispatch,
            state
        }, view) {
            return new Promise(resolve => {
                dispatch('delVisitedView', view)
                dispatch('delCachedView', view)
                resolve({
                    visitedViews: [...state.visitedViews],
                    cachedViews: [...state.cachedViews],
                    delIndex: state.delIndex
                })
            })
        },
        delVisitedView({
            commit,
            state
        }, view) {
            return new Promise(resolve => {
                commit('DEL_VISITED_VIEW', view)
                resolve([...state.visitedViews])
            })
        },
        delCachedView({
            commit,
            state
        }, view) {
            return new Promise(resolve => {
                commit('DEL_CACHED_VIEW', view)
                resolve([...state.cachedViews])
            })
        },

        delOthersViews({
            dispatch,
            state
        }, view) {
            return new Promise(resolve => {
                dispatch('delOthersVisitedViews', view)
                dispatch('delOthersCachedViews', view)
                resolve({
                    visitedViews: [...state.visitedViews],
                    cachedViews: [...state.cachedViews]
                })
            })
        },
        delOthersVisitedViews({
            commit,
            state
        }, view) {
            return new Promise(resolve => {
                commit('DEL_OTHERS_VISITED_VIEWS', view)
                resolve([...state.visitedViews])
            })
        },
        delOthersCachedViews({
            commit,
            state
        }, view) {
            return new Promise(resolve => {
                commit('DEL_OTHERS_CACHED_VIEWS', view)
                resolve([...state.cachedViews])
            })
        },

        delAllViews({
            dispatch,
            state
        }, view) {
            return new Promise(resolve => {
                dispatch('delAllVisitedViews', view)
                dispatch('delAllCachedViews', view)
                resolve({
                    visitedViews: [...state.visitedViews],
                    cachedViews: [...state.cachedViews]
                })
            })
        },
        delAllVisitedViews({
            commit,
            state
        }) {
            return new Promise(resolve => {
                commit('DEL_ALL_VISITED_VIEWS')
                resolve([...state.visitedViews])
            })
        },
        delAllCachedViews({
            commit,
            state
        }) {
            return new Promise(resolve => {
                commit('DEL_ALL_CACHED_VIEWS')
                resolve([...state.cachedViews])
            })
        },

        updateVisitedView({
            commit
        }, view) {
            commit('UPDATE_VISITED_VIEW', view)
        }
        ,
        getAllMenus({commit}){
            http.get('getRouters').then(res=>{
                commit('GET_ALL_MENUS', res.data.data)
            })
        }
        ,
        getUserId({commit},payload){
            commit('GEU_USER_ID',payload)
        },
        removeViews({commit}){
            commit('REMOVE_VIEWS')
        },
        removeMenus({commit}){
            commit('REMOVE_MENUS')
        },
        getUserInfo({commit},payload){
            commit('GET_USER_INFO',payload)
        },
        //退出时清除喷码页的定时器
        clearTimer({commit}){
            commit("CLEAR_TIMER")
        }
    }
}

export default tagsView
