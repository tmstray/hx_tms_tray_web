export default {
    LOGIN_IN(state, token) {
        state.UserToken = token
    },
    LOGIN_OUT(state) {
        state.UserToken = ''
    },
    toggleNavCollapse(state) {
        state.isSidebarNavCollapse = !state.isSidebarNavCollapse
    },
    setCrumbList(state, router) {
        console.log('router', router)
        if(router.length!="0"){
            let crumbList = router[1].meta.name.split('/')
            state.crumbList = crumbList
        }
    },
}
