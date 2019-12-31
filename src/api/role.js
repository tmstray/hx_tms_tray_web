import http from '@/config/httpConfig.js'
const urlLists = {
    getRoleList: '/system/role/list',
    updateStockInfo: '/trayInfo/updateTrayInfo',
    getMenuList:"/system/menu/list",
    addRole:"/system/role",
    deleteRole:"/system/role/{roleIds}"
}
export const getRoleList = (params) => {
    return http.get(urlLists.getRoleList, params)
}
export const updateStockInfo = (params) => {
    return http.post(urlLists.updateStockInfo, params)
}
export const getMenuList = (params) => {
    return http.get(urlLists.getMenuList, params)
}
export const addRole = (params) => {
    return http.post(urlLists.addRole, params)
}
export const deleteRole = (params) => {
    return http.delete(urlLists.deleteRole, params)
}
