import axios from 'axios'

const baseURL = (import.meta as any).env.VITE_API_ENDPOINT

const instance = axios.create({
  baseURL
})
instance.interceptors.request.use((config) => {
  if (config.url && config.url.startsWith('/api/')) {
    config.url = config.url.replace('/api/', '/')
    config.url = `${baseURL}${config.url}`
  }
  return config
})

export default instance
