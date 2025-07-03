
import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:1337/api';

const createEvent = (data) => {
  return axios.post(`${API_URL}/events`, { data }, { headers: authHeader() });
};

const joinEvent = (eventDocumentId, userId) => {
  return axios.put(`${API_URL}/events/${eventDocumentId}`, { data: { attendees: { connect: userId } } }, { headers: authHeader() });
};

const getMyEvents = (userId) => {
  const createdByQuery = `filters[creator][id][$eq]=${userId}`;
  const participatingQuery = `filters[participants][id][$eq]=${userId}`;
  return axios.get(`${API_URL}/events?populate=*&${createdByQuery}&${participatingQuery}`, { headers: authHeader() });
};

const getEvent = (documentId) => {
  return axios.get(`${API_URL}/events/${documentId}?populate=*`);
};

const updateEvent = (documentId, data) => {
  return axios.put(`${API_URL}/events/${documentId}`, { data }, { headers: authHeader() });
};

const deleteEvent = (id) => {
  return axios.delete(`${API_URL}/events/${id}`, { headers: authHeader() });
};

const eventService = {
  createEvent,
  joinEvent,
  getMyEvents,
  getEvent,
  updateEvent,
  deleteEvent,
};

export default eventService;
