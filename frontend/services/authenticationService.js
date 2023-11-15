import axiosInstance from './axios.js'

export const registerUser = async (userData) => {
  return await axiosInstance.post("/users", userData)
}

export const login = async (userData) => {
  return await axiosInstance.post("/token", userData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  })
}

export const obtenerUsuarioAutenticado = async () => {
  return await axiosInstance.get("/users/me")
}