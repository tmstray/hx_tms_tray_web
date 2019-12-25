import http from '@/config/httpConfig.js'
const urlLists = {
    getUserList: '/system/user/list',
    updateStockInfo: '/trayInfo/updateTrayInfo'
}
export const getUserLists = (params) => {
    return http.post(urlLists.getUserList, params)
}
export const updateStockInfo = (params) => {
    return http.post(urlLists.updateStockInfo, params)
}
