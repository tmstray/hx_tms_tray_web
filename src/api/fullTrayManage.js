import http from '@/config/httpConfig.js'
const urlLists = {
    getStockLists: '/trayInfo/fullTrayList',
    updateStockInfo: '/trayInfo/updateTrayInfo'
}
export const getStockLists = (params) => {
    return http.post(urlLists.getStockLists, params)
}
export const updateStockInfo = (params) => {
    return http.post(urlLists.updateStockInfo, params)
}
