import axios from 'axios'
import { API_BASE_URL } from '@/urlconfig.js'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // optional
})

export default apiClient
