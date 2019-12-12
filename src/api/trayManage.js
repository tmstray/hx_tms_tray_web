import http from '@/config/httpConfig.js'
const urlLists = {
    getTrayLists: '/trayInfo/list',
    forzenRow: '/trayInfo/freeZeTrayInfo',
    updateRow: '/trayInfo/updateTrayInfo'
}
export const getTrayLists = (params) => {
    return http.post(urlLists.getTrayLists, params)
}
export const forzenRow = (params) => {
    return http.post(urlLists.forzenRow, params)
}
export const updateRow = (params) => {
    return http.post(urlLists.updateRow, params)
}
