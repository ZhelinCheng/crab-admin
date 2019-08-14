/**
 * Created by ChengZheLin on 2019/8/10.
 * Features:
 */

import { get, put, del, post } from './http'

/**
 * 获取任务列表
 * @param params
 * @returns {Promise<void>}
 */
export async function apiGetTasks (params) {
  return get('/tasks', params)
}

/**
 * 更新任务
 * @param params
 * @returns {Promise<void>}
 */
export async function apiPutItem (params) {
  return put('/tasks/item-update', params)
}

/**
 * 添加任务
 * @param params
 * @returns {Promise<void>}
 */
export async function apiAddItem (params) {
  return post('/tasks/item-add', params)
}

/**
 * 删除任务
 * @param params
 * @returns {Promise<void>}
 */
export async function apiDelItem (params) {
  return del('/tasks/item-del', params)
}

/**
 * 获取任务详情
 * @param params
 * @returns {Promise<void>}
 */
export async function apiGetItem (params) {
  return get('/tasks/item-info', params)
}

export async function login (params) {
  return post('/users/login', params)
}

export async function registered (params) {
  return post('/users/registered', params)
}
