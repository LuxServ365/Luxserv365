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

export const messageApi = {
  // Submit owner message
  submitMessage: async (messageData) => {
    try {
      const response = await apiClient.post('/messages', messageData);
      return response.data;
    } catch (error) {
      console.error('Message submission error:', error);
      throw error;
    }
  },

  // Get messages for specific owner
  getOwnerMessages: async (ownerEmail) => {
    try {
      const response = await apiClient.get(`/messages/owner/${encodeURIComponent(ownerEmail)}`);
      return response.data;
    } catch (error) {
      console.error('Get owner messages error:', error);
      throw error;
    }
  },

  // Get all messages (admin endpoint)
  getAllMessages: async () => {
    try {
      const response = await apiClient.get('/messages');
      return response.data;
    } catch (error) {
      console.error('Get all messages error:', error);
      throw error;
    }
  }
};

export const inspectionApi = {
  // Create inspection report
  createReport: async (reportData, reportFile) => {
    try {
      const formData = new FormData();
      formData.append('title', reportData.title);
      formData.append('notes', reportData.notes);
      formData.append('ownerEmail', reportData.ownerEmail);
      formData.append('propertyAddress', reportData.propertyAddress);
      formData.append('inspectionDate', reportData.inspectionDate);
      
      if (reportFile) {
        formData.append('reportFile', reportFile);
      }

      const response = await apiClient.post('/inspections', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Inspection report creation error:', error);
      throw error;
    }
  },

  // Get inspection reports for owner
  getOwnerReports: async (ownerEmail) => {
    try {
      const response = await apiClient.get(`/inspections/owner/${encodeURIComponent(ownerEmail)}`);
      return response.data;
    } catch (error) {
      console.error('Get owner inspections error:', error);
      throw error;
    }
  },

  // Download inspection file
  downloadFile: async (filename) => {
    try {
      const response = await apiClient.get(`/inspections/file/${filename}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Download inspection file error:', error);
      throw error;
    }
  }
};

export const photoApi = {
  // Upload photos
  uploadPhotos: async (photoData, photoFiles) => {
    try {
      const formData = new FormData();
      formData.append('ownerEmail', photoData.ownerEmail);
      formData.append('propertyAddress', photoData.propertyAddress);
      if (photoData.caption) {
        formData.append('caption', photoData.caption);
      }

      photoFiles.forEach((file) => {
        formData.append('photos', file);
      });

      const response = await apiClient.post('/photos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Photo upload error:', error);
      throw error;
    }
  },

  // Get photos for owner
  getOwnerPhotos: async (ownerEmail) => {
    try {
      const response = await apiClient.get(`/photos/owner/${encodeURIComponent(ownerEmail)}`);
      return response.data;
    } catch (error) {
      console.error('Get owner photos error:', error);
      throw error;
    }
  },

  // Get photo file URL
  getPhotoUrl: (filename) => {
    return `${API}/photos/file/${filename}`;
  }
};

export const guestApi = {
  // Submit guest request (simplified without photos)
  submitRequest: async (requestData) => {
    try {
      // Simple JSON submission without photos
      const response = await apiClient.post('/guest-requests', requestData);
      return response.data;
    } catch (error) {
      console.error('Guest request submission error:', error);
      throw error;
    }
  },

  // Get request status by confirmation number
  getRequestStatus: async (confirmationNumber) => {
    try {
      const response = await apiClient.get(`/guest-requests/${confirmationNumber}`);
      return response.data;
    } catch (error) {
      console.error('Get request status error:', error);
      throw error;
    }
  },

  // Get all guest requests (admin)
  getAllRequests: async () => {
    try {
      const response = await apiClient.get('/guest-requests');
      return response.data;
    } catch (error) {
      console.error('Get all guest requests error:', error);
      throw error;
    }
  },

  // Get guest photo URL
  getGuestPhotoUrl: (filename) => {
    return `${API}/guest-photos/${filename}`;
  }
};

export const adminApi = {
  // Admin login
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/admin/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  },

  // Get guest requests with filtering
  getRequests: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });
      
      const response = await apiClient.get(`/admin/guest-requests?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get admin requests error:', error);
      throw error;
    }
  },

  // Update guest request
  updateRequest: async (requestId, updateData) => {
    try {
      const response = await apiClient.put(`/admin/guest-requests/${requestId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Update request error:', error);
      throw error;
    }
  },

  // Send reply to guest
  sendReply: async (requestId, replyData) => {
    try {
      const response = await apiClient.post(`/admin/guest-requests/${requestId}/reply`, replyData);
      return response.data;
    } catch (error) {
      console.error('Send reply error:', error);
      throw error;
    }
  },

  // Get analytics
  getAnalytics: async () => {
    try {
      const response = await apiClient.get('/admin/analytics');
      return response.data;
    } catch (error) {
      console.error('Get analytics error:', error);
      throw error;
    }
  },

  // Bulk update requests
  bulkUpdateRequests: async (requestIds, updateData) => {
    try {
      const response = await apiClient.put('/admin/guest-requests/bulk-update', {
        requestIds,
        ...updateData
      });
      return response.data;
    } catch (error) {
      console.error('Bulk update error:', error);
      throw error;
    }
  }
};

export default apiClient;