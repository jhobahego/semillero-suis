import axiosInstance from './axios.js'

export const createEvent = async (eventData) => {
  return await axiosInstance.post('/events/', eventData)
}

export const getEvents = async () => {
  return await axiosInstance.get("/events")
}

export const getEvent = async (eventId) => {
  return await axiosInstance.get(`/events/${eventId}`)
}

export const updateEvent = async (eventId, eventToUpdate) => {
  return await axiosInstance.put(`/events/${eventId}`, eventToUpdate)
}