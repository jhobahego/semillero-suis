import axiosInstance from './axios.js'

export const createEvent = async (eventData) => {
  return await axiosInstance.post('/events/', eventData)
}

export const getEvents = async () => {
  return await axiosInstance.get("/events")
}