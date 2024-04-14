import axios from 'axios'

const instance = axios.create({
  baseURL: (import.meta as any).env.VITE_API_ENDPOINT
})
instance.interceptors.request.use((config) => {
  if (config.url && config.url.startsWith('/api/')) {
    config.url = config.url.replace('/api/', '/')
    config.url = `http://127.0.0.1:3000${config.url}`
  }
  return config
})

export default instance
