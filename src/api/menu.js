import http from '@/config/httpConfig.js'
const urlLists = {
    getMenuList: '/system/menu/list',
    updateStockInfo: '/trayInfo/updateTrayInfo',
    addMenus:"/system/menu",
    updateMenus:"/system/menu"
}
export const getMenuList = (params) => {
    return http.get(urlLists.getMenuList, params)
}
export const updateStockInfo = (params) => {
    return http.post(urlLists.updateStockInfo, params)
}
export const addMenus = (params) => {
    return http.post(urlLists.addMenus, params)
}
export const updateMenus = (params) => {
    return http.put(urlLists.updateMenus, params)
}
