import axios from '../node_modules/axios/dist/esm/axios.min.js'
import { notificationUtilities } from './notificationService.js'

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
    const { status, data } = response
    console.log({ status, data })
    if (status > 201) {
      notificationUtilities.success(data.detail)
    }

    return response
  },
  (error) => {
    const { data, status } = error.response

    let errorText = ""

    if (status === 422) {
      const validationErrors = data.detail.map((element) => {
        const field = element.loc[1];
        const fieldValue = element.input;
        return `Valor ${fieldValue} del campo ${field} inválido`;
      });
      errorText = validationErrors.join(". ");
    } else {
      errorText = data.detail;
    }

    notificationUtilities.error(errorText)

    return Promise.reject(error)
  }
)

export default axiosInstance