import axiosInstance from "./axios"

export const getUsers = async () => {
  return await axiosInstance.get("/users")
}