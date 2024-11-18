import axios from 'axios'
import to from 'await-to-js'
const ConfigBaseURL = 'http://127.0.0.1:5000/'


//使用create方法创建axios实例
export const Service = axios.create({
  // timeout: 10000, // 请求超时时间
  baseURL: ConfigBaseURL,
  method: 'post',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

// 添加请求拦截器
Service.interceptors.request.use(config => {
  return config
})
// 添加响应拦截器
Service.interceptors.response.use(response => {
  // console.log(response)
  return response.data
}, error => {
  return Promise.reject(error)
})

// 使用await-to-js去捕获await时的错误
export function isObj(obj) {
  const typeCheck = typeof obj!=='undefined' && typeof obj === 'object' && obj !== null
  return typeCheck && Object.keys(obj).length > 0
}

//封装的get
export async function _get(url, qs,headers) {
  const params = {
    url,
    method: 'get',
    params: isObj(qs) ? qs : {}
  }
  if(isObj(headers)){params.headers = headers}
  const [err, res] = await to(Service(params))
  if (!err && res) {
    return res
  } else {
    return console.log(err)
  }
}

//封装的post
export async function _post(url, qs, body,headers) {
  const params = {
    url,
    method: 'post',
    params: isObj(qs) ? qs : {},
    data: isObj(body) ? body : {}
  }
  if(isObj(headers)){params.headers = headers}
  const [err, res] = await to(Service(params))
  if (!err && res) {
    return res
  } else {
    return console.log(err)
  }
}


//封装的put
export async function _put(url, qs, body,headers) {
  const params = {
    url,
    method: 'put',
    params: isObj(qs) ? qs : {},
    data: isObj(body) ? body : {}
  }
  if(isObj(headers)){params.headers = headers}
  const [err, res] = await to(Service(params))
  if (!err && res) {
    return res
  } else {
    return console.log(err)
  }
}

//封装的del
export async function _del(url, qs,headers) {
  const params = {
    url,
    method: 'delete',
    params: isObj(qs) ? qs : {}
  }
  if(isObj(headers)){params.headers = headers}
  const [err, res] = await to(Service(params))
  if (!err && res) {
    return res
  } else {
    return console.log(err)
  }
}

// 上传文件封装（支持multipart/form-data）
export async function _file(url, file, formData = {}, headers = {}) {
  const params = {
    url,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
      ...headers
    },
    data: formData
  };

  // 将文件附加到 FormData 中
  const form = new FormData();
  form.append('file', file);
  Object.entries(formData).forEach(([key, value]) => {
    form.append(key, value);
  });

  params.data = form;  // 更新 params 的 data 为 FormData 对象

  const [err, res] = await to(Service(params));
  if (!err && res) {
    return res;
  } else {
    console.log('File Upload Error:', err);
    return Promise.reject(err);
  }
}

// 取消请求功能（可用于中止请求）
export const CancelToken = axios.CancelToken;
export function cancelRequest(cancelTokenSource) {
  cancelTokenSource.cancel('Request cancelled');
}