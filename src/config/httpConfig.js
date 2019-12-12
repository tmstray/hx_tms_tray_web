import axios from 'axios'
import store from '@/store/index.js'
import baseURL from './baseUrl'
import { Message } from 'element-ui'
import { serialize } from '@/utils/util'
const http = {}

var instance = axios.create({
    timeout: 3000,
    baseURL,
    validateStatus(status) {
        switch (status) {
        case 400:
            Message.error('请求出错')
            break
        case 401:
            Message.warning({
                message: '授权失败，请重新登录'
            })
            store.commit('LOGIN_OUT')
            setTimeout(() => {
                window.location.reload()
            }, 1000)
            return
        case 403:
            Message.warning({
                message: '拒绝访问'
            })
            break
        case 404:
            Message.warning({
                message: '请求错误,未找到该资源'
            })
            break
        case 500:
            Message.warning({
                message: '服务端错误'
            })
            break
        }
        return status >= 200 && status <= 500
    }
})

// 添加请求拦截器
instance.interceptors.request.use(
    config => {
        // // 请求头添加token
        // if (store.state.UserToken) {
        //     config.headers.Authorization = `Bearer ${store.state.UserToken}`
        // }
        if (config.method === 'post' && config.headers.serialize) {
            config.data = serialize(config.data)
            delete config.data.serialize
        }
        if (config.method === 'put') {
            config.data = serialize(config.data)
        }

        // if (config.method === 'get') {
        //     for (const key in config.params) {
        //         if (config.params.hasOwnProperty(key)) {
        //             config.url += ('/' + config.params[key])
        //         }
        //     }
        //     config.params = {}
        // }
        // 拼接参数
        // if (config.method === 'get') {
        //     if (config.data && !config.url.includes('?')) {
        //         config.url = config.url + '?'
        //     }
        //     let parmas = config.data || {}
        //     for (let p in parmas) {
        //         config.url = config.url + p + '=' + parmas[p] + '&'
        //     }
        // }
        // 如果所有接口都加了baseUrl,就不用下面的代码，如果想省事就加下面
        // config.url = baseURL + config.url
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 响应拦截器即异常处理
instance.interceptors.response.use(
    response => {
        const httpStatus = Number(response.status)
        const resCode = Number(response.data.code)
        const msg = response.data.msg
        if (httpStatus !== 200) {
            let loading
            loading = document.getElementById('ajaxLoading')
            loading.style.display = 'none'
            if (httpStatus >= 400 && httpStatus < 500) {
                Message.warning({
                    message: '网络错误'
                })
            } else {
                Message.warning({
                    message: '服务器错误'
                })
            }
            return Promise.reject(response)
        }
        if (resCode !== 200) {
            Message.warning({
                message: msg
            })
            return Promise.reject(response)
        }
        return response
    },
    err => {
        if (err && err.response) {
        } else {
            err.response.data.msg = '连接服务器失败'
        }
        return Promise.reject(err)
    }
)

http.get = function (url, params, options) {
    let loading
    if (!options || options.isShowLoading !== false) {
        loading = document.getElementById('ajaxLoading')
        loading.style.display = 'block'
    }
    return new Promise((resolve, reject) => {
        instance
            .get(url, {
                params
            }, options)
            .then(response => {
                if (response.data.code === 200) {
                    loading = document.getElementById('ajaxLoading')
                    loading.style.display = 'none'
                    resolve(response)
                } else {
                    // Message.error({
                    //     message: response.msg
                    // })
                    reject(response)
                }
            })
            .catch(e => {
                console.log(e)
            })
    })
}

http.post = function (url, data, options) {
    let loading
    if (!options || options.isShowLoading !== false) {
        loading = document.getElementById('ajaxLoading')
        loading.style.display = 'block'
    }
    return new Promise((resolve, reject) => {
        instance
            .post(url, data, options)
            .then(response => {
                loading = document.getElementById('ajaxLoading')
                loading.style.display = 'none'
                if (response.data.code === 200) {
                    resolve(response)
                } else {
                    // Message.error({
                    //     message: response.msg
                    // })
                    reject(response)
                }
            })
            .catch(err => {
                loading = document.getElementById('ajaxLoading')
                loading.style.display = 'none'
                console.log(err.data)
            })
    })
}
http.put = function (url, data, options) {
    let loading
    if (!options || options.isShowLoading !== false) {
        loading = document.getElementById('ajaxLoading')
        loading.style.display = 'block'
    }
    return new Promise((resolve, reject) => {
        instance
            .put(url, data, options)
            .then(response => {
                loading = document.getElementById('ajaxLoading')
                loading.style.display = 'none'
                if (response.data.code === 200) {
                    resolve(response)
                } else {
                    // Message.error({
                    //     message: response.msg
                    // })
                    reject(response)
                }
            })
            .catch(err => {
                loading = document.getElementById('ajaxLoading')
                loading.style.display = 'none'
                console.log(err.data)
            })
    })
}

export default http
