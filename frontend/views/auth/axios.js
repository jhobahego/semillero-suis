import axios from '../../node_modules/axios/dist/esm/axios.min.js'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  }
})

const token = localStorage.getItem("token")

if (token != undefined) {
  axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + token
}

export default axiosInstance