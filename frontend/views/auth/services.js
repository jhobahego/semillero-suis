import axios from '../../node_modules/axios/dist/esm/axios.min.js'

const axiosConfig = {
  headers: {
    'Content-Type': 'application/json'
  }
}

export const registerUser = async (userData) => {
  return await axios.post("http://localhost:8000/users", userData, axiosConfig)
}