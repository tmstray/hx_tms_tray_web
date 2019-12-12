import http from '@/config/httpConfig.js'
const urlLists = {
    getStockLists: '/trayInfo/listGroupByStatus'
}
export const getStockLists = (params) => {
    return http.post(urlLists.getStockLists, params)
}
