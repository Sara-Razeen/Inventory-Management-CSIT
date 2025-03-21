
import { toast } from "sonner";

// Base URL for the Django API
const API_BASE_URL = 'http://localhost:8000/api'; // Change this to your Django API URL

// Function to handle API errors
const handleApiError = (error: any) => {
  console.error('API Error:', error);
  
  let errorMessage = 'An unexpected error occurred';
  
  if (error.response) {
    // Server responded with an error
    errorMessage = error.response.data?.detail || 
                  error.response.data?.message || 
                  `Error: ${error.response.status}`;
  } else if (error.request) {
    // Request made but no response received
    errorMessage = 'No response from server. Please check your connection.';
  }
  
  toast.error(errorMessage);
  return Promise.reject(error);
};

// Create headers with auth token (if available)
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Use a session storage or secure cookie approach instead of localStorage
  // const token = sessionStorage.getItem('authToken');
  // if (token) {
  //   headers['Authorization'] = `Bearer ${token}`;
  // }
  
  return headers;
};

// Generic GET request
export const fetchData = async (endpoint: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

// Generic POST request
export const postData = async (endpoint: string, data: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

// Generic PUT request
export const updateData = async (endpoint: string, data: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

// Generic DELETE request
export const deleteData = async (endpoint: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    // Some DELETE endpoints return no content
    if (response.status === 204) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

// Authentication functions
export const authService = {
  login: async (username: string, password: string) => {
    return postData('/auth/login/', { username, password });
  },
  
  logout: async () => {
    // sessionStorage.removeItem('authToken');
    return postData('/auth/logout/', {});
  },
  
  getCurrentUser: async () => {
    return fetchData('/auth/user/');
  }
};

// Inventory functions
export const inventoryService = {
  getAll: async () => {
    return fetchData('/inventory/');
  },
  
  getById: async (id: number) => {
    return fetchData(`/inventory/${id}/`);
  },
  
  create: async (data: any) => {
    return postData('/inventory/', data);
  },
  
  update: async (id: number, data: any) => {
    return updateData(`/inventory/${id}/`, data);
  },
  
  delete: async (id: number) => {
    return deleteData(`/inventory/${id}/`);
  }
};

// Notifications functions
export const notificationService = {
  getAll: async () => {
    return fetchData('/notifications/');
  },
  
  markAsRead: async (id: number) => {
    return updateData(`/notifications/${id}/read/`, {});
  },
  
  markAllAsRead: async () => {
    return postData('/notifications/mark-all-read/', {});
  },
  
  create: async (data: any) => {
    return postData('/notifications/', data);
  }
};

// Procurement functions
export const procurementService = {
  getAll: async () => {
    return fetchData('/procurements/');
  },
  
  getById: async (id: number) => {
    return fetchData(`/procurements/${id}/`);
  },
  
  create: async (data: any) => {
    return postData('/procurements/', data);
  }
};

// Stock request functions
export const stockRequestService = {
  getAll: async () => {
    return fetchData('/stock-requests/');
  },
  
  getById: async (id: number) => {
    return fetchData(`/stock-requests/${id}/`);
  },
  
  create: async (data: any) => {
    return postData('/stock-requests/', data);
  },
  
  updateStatus: async (id: number, status: string) => {
    return updateData(`/stock-requests/${id}/status/`, { status });
  }
};
