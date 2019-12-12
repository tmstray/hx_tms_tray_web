// webpack 提供的方法来解析路由
const files = require.context('.', true, /\.js$/)
var routesMap = []
files.keys().forEach((key) => {
    if (key === './index.js') return
    routesMap = routesMap.concat(files(key).default)
})
export default routesMap
