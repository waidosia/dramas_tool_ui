import axios from 'axios'
import to from 'await-to-js'

// API 基础配置
const ConfigBaseURL = 'http://127.0.0.1:5000/'

/**
 * 创建 axios 实例
 * @type {import('axios').AxiosInstance}
 */
export const Service = axios.create({
  // timeout: 10000, // 请求超时时间
  baseURL: ConfigBaseURL,
  // method: 'post',
  // headers: {
  //   'Content-Type': 'application/json;charset=UTF-8'
  // }
})

// 请求拦截器
Service.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
)

// 响应拦截器
Service.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error)
)

/**
 * 检查对象是否有效
 * @param {*} obj - 待检查的对象
 * @returns {boolean} - 是否为有效对象
 */
export function isObj(obj) {
  return typeof obj !== 'undefined' &&
         typeof obj === 'object' &&
         obj !== null &&
         Object.keys(obj).length > 0
}

/**
 * 统一的请求处理函数
 * @param {Object} params - 请求参数
 * @returns {Promise} - 请求结果
 */
async function handleRequest(params) {
  const [err, res] = await to(Service(params))
  if (err) {
    console.error('Request Error:', err)
    return Promise.reject(err)
  }
  return res
}

/**
 * GET 请求封装
 * @param {string} url - 请求地址
 * @param {Object} [qs] - 查询参数
 * @param {Object} [headers] - 请求头
 * @returns {Promise} - 请求结果
 */
export async function _get(url, qs, headers) {
  const params = {
    url,
    method: 'get',
    params: isObj(qs) ? qs : {}
  }
  if (isObj(headers)) {
    params.headers = headers
  }
  return handleRequest(params)
}

/**
 * POST 请求封装
 * @param {string} url - 请求地址
 * @param {Object} [qs] - 查询参数
 * @param {Object} [body] - 请求体
 * @param {Object} [headers] - 请求头
 * @returns {Promise} - 请求结果
 */
export async function _post(url, qs, body, headers) {
  const params = {
    url,
    method: 'post',
    params: isObj(qs) ? qs : {},
    data: isObj(body) ? body : {}
  }
  if (isObj(headers)) {
    params.headers = {
    'Content-Type': 'application/json',
    ...params.headers
    }
  }
  return handleRequest(params)
}

/**
 * PUT 请求封装
 * @param {string} url - 请求地址
 * @param {Object} [qs] - 查询参数
 * @param {Object} [body] - 请求体
 * @param {Object} [headers] - 请求头
 * @returns {Promise} - 请求结果
 */
export async function _put(url, qs, body, headers) {
  const params = {
    url,
    method: 'put',
    params: isObj(qs) ? qs : {},
    data: isObj(body) ? body : {}
  }
  if (isObj(headers)) {
    params.headers = {
    'Content-Type': 'application/json',
    ...params.headers
    }
  }
  return handleRequest(params)
}

/**
 * DELETE 请求封装
 * @param {string} url - 请求地址
 * @param {Object} [qs] - 查询参数
 * @param {Object} [headers] - 请求头
 * @returns {Promise} - 请求结果
 */
export async function _del(url, qs, headers) {
  const params = {
    url,
    method: 'delete',
    params: isObj(qs) ? qs : {}
  }
  if (isObj(headers)) {
    params.headers = headers
  }
  return handleRequest(params)
}

/**
 * 文件上传封装
 * @param {string} url - 上传地址
 * @param {File} file - 文件对象
 * @param {Object} [formData] - 额外的表单数据
 * @param {Object} [headers] - 请求头
 * @returns {Promise} - 上传结果
 */
export async function _file(url, file, formData = {}, headers = {}) {
  const form = new FormData()
  form.append('file', file)

  // 添加额外的表单数据
  Object.entries(formData).forEach(([key, value]) => {
    form.append(key, value)
  })

  const finalHeaders = { ...headers };
   if (finalHeaders['Content-Type']) {
    delete finalHeaders['Content-Type'];
  }

  const params = {
    url,
    method: 'post',
    headers: finalHeaders,
    data: form
  }

  return handleRequest(params)
}

// 导出取消请求相关功能
export const CancelToken = axios.CancelToken

/**
 * 取消请求
 * @param {import('axios').CancelTokenSource} cancelTokenSource - 取消令牌源
 */
export function cancelRequest(cancelTokenSource) {
  cancelTokenSource.cancel('Request cancelled')
}
