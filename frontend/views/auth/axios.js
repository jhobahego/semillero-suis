import axios from '../../node_modules/axios/dist/esm/axios.min.js'
// import Swal from '../../node_modules/sweetalert2/dist/sweetalert2.min.js'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  }
})

const setInTokenInHeaders = (request) => {
  const token = localStorage.getItem("token")

  if (token != undefined) {
    request.headers.Authorization = `Bearer ${token}`
  }

  return request
}

axiosInstance.interceptors.request.use((request) => {
  return setInTokenInHeaders(request)
})

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default axiosInstance