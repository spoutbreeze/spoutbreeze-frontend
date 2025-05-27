import axios from 'axios'
import { refreshToken, clearTokens, getLoginUrl } from './auth'

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers,
  withCredentials: true, // optional depending on the backend
})

// Add access token to each request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 errors and refresh token
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      const newToken = await refreshToken()

      if (newToken) {
        error.config.headers.Authorization = `Bearer ${newToken}`
        return axiosInstance(error.config) // Use axiosInstance instead of axios
      } else {
        clearTokens()
        const returnUrl = window.location.pathname
        const loginUrl = await getLoginUrl() // Await the async function
        window.location.href = `${loginUrl}&redirect_uri=${encodeURIComponent(window.location.origin + returnUrl)}`
        return Promise.reject(error) // Return rejected promise instead of just return
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
