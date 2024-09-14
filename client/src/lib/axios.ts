import axios from 'axios'

import { getToken } from '@/lib/services'
import type { A } from '@/shared/types'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: {
    'Content-Type': 'application/json'
  }
})

namespace Axios {
  export async function get<T>(url: string, config?: any) {
    const token = await getToken()
    axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`
    return axiosInstance.get<T>(url, config)
  }

  export async function post<T>(url: string, data?: T, config?: any) {
    const token = await getToken()
    axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`
    return axiosInstance.post<T>(url, data, config)
  }

  export async function put<T>(url: string, data?: T, config?: any) {
    const token = await getToken()
    axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`
    return axiosInstance.put<T>(url, data, config)
  }

  export async function remove<T>(url: string, config?: any) {
    const token = await getToken()
    axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`
    return axiosInstance.delete<T>(url, config)
  }
  export function pasreError(error: A.Error) {
    return error.response.data
  }
}

export { Axios, Axios as axios, Axios as default }
