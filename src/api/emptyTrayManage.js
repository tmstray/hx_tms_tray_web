import http from '@/config/httpConfig.js'
const urlLists = {
    getStockLists: '/trayInfo/emptyTrayList',
    scrapOrLossTrayInfo: '/trayInfo/scrapOrLossTrayInfo',
    forzenRow: '/trayInfo/freeZeTrayInfo',
    exprotTemplate: '/trayInfo/importTemplate'
}
export const getStockLists = (params) => {
    return http.post(urlLists.getStockLists, params)
}

export const scrapOrLossTrayInfo = (params) => {
    return http.post(urlLists.scrapOrLossTrayInfo, params)
}

export const forzenRow = (params) => {
    return http.post(urlLists.forzenRow, params)
}

export const exprotTemplate = (params) => {
    return http.get(urlLists.exprotTemplate, params)
}