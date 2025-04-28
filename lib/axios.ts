import axios from 'axios'
import { refreshToken, clearTokens, getLoginUrl } from './auth'

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  headers,
  withCredentials: true, // optional depending on your backend
})

// Add access token to each request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401s like BFF
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      const newToken = await refreshToken()

      if (newToken) {
        error.config.headers.Authorization = `Bearer ${newToken}`
        return axios(error.config) // Retry the original request
      } else {
        clearTokens()
        const returnUrl = window.location.pathname
        window.location.href = `${getLoginUrl()}&redirect_uri=${encodeURIComponent(window.location.origin + returnUrl)}`
        return // stop further execution
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
