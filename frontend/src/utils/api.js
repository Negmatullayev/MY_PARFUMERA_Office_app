import axios from 'axios';

// Vercel deployment uses /_/backend as the backend route prefix.
// Local development uses http://localhost:5000
const API_URL = import.meta.env.PROD ? '/_/backend/api' : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL
});

export default api;
