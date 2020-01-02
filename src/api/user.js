import http from '@/config/httpConfig.js'
const urlLists = {
    getUserList: '/system/user/list',
    addUser:"/system/user",
    deleteUsers:"/system/user/userIds",
    updateUsers:"/system/user"
}
export const getUserLists = (params) => {
    return http.post(urlLists.getUserList, params)
}
export const updateStockInfo = (params) => {
    return http.post(urlLists.updateStockInfo, params)
}
export const addUser = (params) => {
    return http.post(urlLists.addUser, params)
}
export const deleteUsers = (params) => {
    return http.delete(urlLists.deleteUsers, params)
}
export const updateUsers = (params) => {
    return http.put(urlLists.updateUsers, params)
}
