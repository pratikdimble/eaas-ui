import axios from 'axios'
import { API_BASE_URL } from '@/urlconfig.js'
import { token, clearAuth } from '@/auth'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Attach token to every request
apiClient.interceptors.request.use(
  (config) => {
    if (token.value) {
      config.headers.Authorization = `Bearer ${token.value}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Optional: auto logout if 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      clearAuth()
      window.location.href = '/'
    }
    return Promise.reject(error)
  },
)

export default apiClient
