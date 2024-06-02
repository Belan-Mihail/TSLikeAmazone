import axios from 'axios'

const apiClient = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development' ? 'http://localhost:4000/' : '/',
  headers: {
    'Content-type': 'application/json',
  },
})

// interceptors aloww us to modify apiClient. before sending it 
// we want to put in the header of request bearer token to auth the user
// we past async function as parametr. config it is a current config apiClient that we want to modify
apiClient.interceptors.request.use(
  async (config) => {
    // ii in localStorage exist userInfo
    if (localStorage.getItem('userInfo'))
      // we add config.headers.authorization new value = Bearer and token
      config.headers.authorization = `Bearer ${
        JSON.parse(localStorage.getItem('userInfo')!).token
      }`
    return config
  },
  // second parametr error
  (error) => {
    Promise.reject(error)
  }
)

export default apiClient

// 5:00:00