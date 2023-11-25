import axiosInstance from "./axios"

export const getUsers = async () => {
  return await axiosInstance.get("/users")
}

export const getUser = async (userId) => {
  return await axiosInstance.get(`/users/${userId}`)
}