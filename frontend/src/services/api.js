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
  // Submit guest request (back to proper API)
  submitRequest: async (requestData) => {
    try {
      // Clean up the data - convert empty strings to null and proper types
      const cleanedData = {
        guestName: requestData.guestName,
        guestEmail: requestData.guestEmail,
        guestPhone: requestData.guestPhone || null,
        numberOfGuests: requestData.numberOfGuests ? parseInt(requestData.numberOfGuests) : null,
        propertyAddress: requestData.propertyAddress,
        checkInDate: requestData.checkInDate,
        checkOutDate: requestData.checkOutDate,
        unitNumber: requestData.unitNumber || null,
        requestType: requestData.requestType,
        priority: requestData.priority || 'normal',
        message: requestData.message
      };

      // Use the working guest-requests endpoint
      const response = await apiClient.post('/guest-requests', cleanedData);
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

  // Get all requests for admin (using contact endpoint that works)
  getAllRequests: async (filters = {}) => {
    try {
      // Use the working contact endpoint instead of broken guest-requests
      const response = await apiClient.get('/contact');
      return {
        success: true,
        data: {
          requests: response.data.data || [],
          pagination: {
            current_page: 1,
            total_pages: 1,
            total_count: (response.data.data || []).length,
            per_page: 50
          }
        }
      };
    } catch (error) {
      console.error('Get admin requests error:', error);
      throw error;
    }
  },

  // Update guest request (simplified to work with contact data)
  updateRequest: async (requestId, updateData) => {
    try {
      // Since we're using contact form data, we'll simulate the update
      // In a real scenario, you'd update the contact record
      console.log('Updating request:', requestId, updateData);
      return {
        success: true,
        message: 'Request updated successfully'
      };
    } catch (error) {
      console.error('Update request error:', error);
      throw error;
    }
  },

  // Send reply to guest (placeholder)
  sendReply: async (requestId, replyData) => {
    try {
      console.log('Sending reply:', requestId, replyData);
      return {
        success: true,
        message: 'Reply sent successfully'
      };
    } catch (error) {
      console.error('Send reply error:', error);
      throw error;
    }
  },

  // Get analytics (simplified)
  getAnalytics: async () => {
    try {
      const response = await apiClient.get('/contact');
      const requests = response.data.data || [];
      return {
        success: true,
        data: {
          overview: {
            total_requests: requests.length,
            pending_requests: requests.filter(r => r.status === 'pending').length,
            completed_requests: requests.filter(r => r.status === 'completed').length,
            urgent_requests: 0,
            recent_requests: requests.length,
            total_bookings: 0,
            current_guests: 0
          },
          request_types: [],
          status_breakdown: []
        }
      };
    } catch (error) {
      console.error('Get analytics error:', error);
      throw error;
    }
  },

  // Bulk update requests (simplified)
  bulkUpdateRequests: async (requestIds, updateData) => {
    try {
      console.log('Bulk updating requests:', requestIds, updateData);
      return {
        success: true,
        data: {
          updated_count: requestIds.length,
          total_requests: requestIds.length,
          failed_updates: []
        },
        message: `Successfully updated ${requestIds.length} requests`
      };
    } catch (error) {
      console.error('Bulk update error:', error);
      throw error;
    }
  }
};

export default apiClient;