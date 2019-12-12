
import http from '@/config/httpConfig.js'
const urlLists = {
    getProductLineLists: '/spurtcodes/ztlines/list',
    getInkjetPrinterInfo: '/spurtcodes/current-spurtcode',
    getRules: '/spurtcodes/rule',
    getBindInfo: '/first_bind',
    getLog: '/first_bind/list',
    updateCurrentCode: '/spurtcodes/current-spurtcode',
    updateCurrentNumber: '/spurtcodes/current-number',
    updateRule: '/spurtcodes/rule',
    updateBindInfo: '/first_bind',
    addReason: '/first_bind/scrap',
    startSchedule: '/spurtcodes/start',
    endSchedule: '/spurtcodes/stop'
}
export const getProductLineLists = (params) => {
    return http.get(urlLists.getProductLineLists, params)
}
export const getInkjetPrinterInfo = (params) => {
    return http.get(urlLists.getInkjetPrinterInfo, params,{isShowLoading:false})
}
export const getRules = (params) => {
    return http.get(urlLists.getRules, params)
}
export const getBindInfo = (params) => {
    return http.get(urlLists.getBindInfo, params,{isShowLoading:false})
}
export const getLogs = (params) => {
    return http.post(urlLists.getLog, params)
}
export const updateCurrentCode = (params) => {
    return http.put(urlLists.updateCurrentCode, params)
}
export const updateCurrentNumber = (params) => {
    return http.put(urlLists.updateCurrentNumber, params)
}
export const updateRule = (params) => {
    return http.put(urlLists.updateRule, params)
}
export const updateBindInfo = (params) => {
    return http.put(urlLists.updateBindInfo, params)
}
export const addReason = (params) => {
    return http.put(urlLists.addReason, params)
}
export const startSchedule = (params) => {
    return http.put(urlLists.startSchedule, params)
}
export const endSchedule = (params) => {
    return http.put(urlLists.endSchedule, params)
}
