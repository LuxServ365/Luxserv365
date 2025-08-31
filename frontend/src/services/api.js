import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }
    
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      if (data?.message) {
        throw new Error(data.message);
      } else if (data?.error) {
        throw new Error(data.error);
      } else {
        throw new Error(`Server error: ${status}`);
      }
    } else if (error.request) {
      // Request made but no response received
      throw new Error('Unable to connect to server. Please check your internet connection.');
    } else {
      // Something else happened
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
);

// API functions
export const contactApi = {
  // Submit contact form
  submit: async (formData) => {
    try {
      const response = await apiClient.post('/contact', formData);
      return response.data;
    } catch (error) {
      console.error('Contact form submission error:', error);
      throw error;
    }
  },

  // Get all contact submissions (admin endpoint)
  getAll: async () => {
    try {
      const response = await apiClient.get('/contact');
      return response.data;
    } catch (error) {
      console.error('Get contact submissions error:', error);
      throw error;
    }
  }
};

export default apiClient;