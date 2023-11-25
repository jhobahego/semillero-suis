import axiosInstance from './axios.js'

export const createEvent = async (eventData) => {
  return await axiosInstance.post('/events/', eventData)
}