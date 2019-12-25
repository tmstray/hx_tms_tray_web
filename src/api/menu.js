import http from '@/config/httpConfig.js'
const urlLists = {
    getMenuList: '/system/menu/list',
    updateStockInfo: '/trayInfo/updateTrayInfo'
}
export const getMenuList = (params) => {
    return http.post(urlLists.getMenuList, params)
}
export const updateStockInfo = (params) => {
    return http.post(urlLists.updateStockInfo, params)
}
