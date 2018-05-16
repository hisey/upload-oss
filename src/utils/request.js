import axios from 'axios'
// import {
//   baseUrl
// } from '../utils/env'

import qs from 'qs'
let baseUrl=""
if (process.env.NODE_ENV == 'development') {
	baseUrl = 'http://192.168.10.109:7080/';
} else if (process.env.NODE_ENV == 'production') {
	
}

// axios.defaults.withCredentials = true;
// 发送请求前处理request的数据
axios.defaults.transformRequest = [function(data) {
  let newData = ''
  for (let k in data) {
    newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&'
  }
  return newData;
}];

axios.interceptors.request.use(config => {
  // loading
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  return response
}, error => {
  return Promise.resolve(error.response)
})

function checkStatus(response) {
  // loading
  // 如果http状态码正常，则直接返回数据
  // console.log(response.status);
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    // console.log(response);
    return response.data;
    // return false
    // 如果不需要除了data之外的数据，可以直接 return response.data
  } else {
    // 异常状态下，把错误信息返回去
    return {
      status: -404,
      msg: '网络异常'
    }
  }
}

function checkCode(res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  // console.log(res);
  // if (res.status === -404) {
  //   alert(res.msg);
  //   // return false;
  // }
  // console.log(res);
  if (res && (res.status != 200)) {
    alert(res.msg);
    // return false;
  }
  return res;
}

export default {
  post(url, data) {
    return axios({
      method: 'post',
      baseURL: baseUrl,
      url,
      data: qs.stringify(data),
      timeout: 10000,
      // headers: {
      //   'X-Requested-With': 'XMLHttpRequest',
      //   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;'
      // }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  get(url, params) {
    return axios({
      method: 'get',
      baseURL: baseUrl,
      url,
      params, // get 请求时带的参数
      timeout: 10000,
      // headers: {
      //   'X-Requested-With': 'XMLHttpRequest'
      // }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
          // console.log(res);
        return checkCode(res)
      }
    )
  }
}

// import axios from 'axios'
// import { Message, MessageBox } from 'element-ui'
// import store from '../store'
// import { getToken } from '@/utils/auth'
//
// let baseUrl=""
// if (process.env.NODE_ENV == 'development') {
// 	baseUrl = 'http://192.168.10.109:7080/';
// 	// baseUrl = 'http://ndeducate.tsgxh.org'
// } else if (process.env.NODE_ENV == 'production') {
// 	//baseUrl = 'http://ddt.ggszwh.com/ndduoduo/';
// 	// baseUrl = 'http://ndeducate.tsgxh.org'
// }
//
// // 创建axios实例
// const service = axios.create({
//   baseURL: baseUrl, // api的base_url
//   timeout: 15000 // 请求超时时间
// })
//
// // request拦截器
// service.interceptors.request.use(config => {
//   if (store.getters.token) {
//     config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
//   }
//   return config
// }, error => {
//   // Do something with request error
//   console.log(error) // for debug
//   Promise.reject(error)
// })
//
// // respone拦截器
// service.interceptors.response.use(
//   response => {
//   /**
//   * code为非20000是抛错 可结合自己业务进行修改
//   */
//     const res = response.data
//     if (res.code !== 20000) {
//       Message({
//         message: res.message,
//         type: 'error',
//         duration: 5 * 1000
//       })
//
//       // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
//       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//         MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
//           confirmButtonText: '重新登录',
//           cancelButtonText: '取消',
//           type: 'warning'
//         }).then(() => {
//           store.dispatch('FedLogOut').then(() => {
//             location.reload()// 为了重新实例化vue-router对象 避免bug
//           })
//         })
//       }
//       return Promise.reject('error')
//     } else {
//       return response.data
//     }
//   },
//   error => {
//     console.log('err' + error)// for debug
//     Message({
//       message: error.message,
//       type: 'error',
//       duration: 5 * 1000
//     })
//     return Promise.reject(error)
//   }
// )
//
// export default service
