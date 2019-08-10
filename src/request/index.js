/**
 * Created by ChengZheLin on 2019/8/10.
 * Features:
 */

import { get, put, del } from './http'

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
  return put('/tasks/item', params)
}

/**
 * 删除任务
 * @param params
 * @returns {Promise<void>}
 */
export async function apiDelItem (params) {
  return del('/tasks/item', params)
}
