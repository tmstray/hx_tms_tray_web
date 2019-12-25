import http from '@/config/httpConfig.js'
const urlLists = {
    getRoleList: '/system/role/list',
    updateStockInfo: '/trayInfo/updateTrayInfo'
}
export const getRoleList = (params) => {
    return http.get(urlLists.getRoleList, params)
}
export const updateStockInfo = (params) => {
    return http.post(urlLists.updateStockInfo, params)
}
