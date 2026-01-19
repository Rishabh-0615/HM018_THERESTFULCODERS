// API Base URL - automatically uses production or local based on environment
export const API_BASE_URL = import.meta.env.PROD 
  ? '' // In production, use same domain (backend serves frontend)
  : 'http://localhost:5005'; // In development, use local backend

export default API_BASE_URL;
