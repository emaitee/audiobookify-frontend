export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://192.168.0.138:8081/api';

// Normal Fetch Helpers (unauthenticated)
export const apiHelper = {
  get: async (endpoint) => {
    try {
      return await fetch(`${API_BASE_URL}${endpoint}`);
    } catch (error) {
      handleError(error, 'GET');
    }
  },

  post: async (endpoint, body) => {
    try {
      return await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    } catch (error) {
      handleError(error, 'POST');
    }
  },

  put: async (endpoint, body) => {
    try {
      return await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    } catch (error) {
      handleError(error, 'PUT');
    }
  },

  delete: async (endpoint) => {
    try {
      return await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
      });
    } catch (error) {
      handleError(error, 'DELETE');
    }
  },
};

// Authenticated Fetch Helpers
export const authApiHelper = {
  get: async (endpoint) => {
    let token = localStorage.getItem('token')||""
    try {
      return await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'x-auth-token': token,
        },
      });
    } catch (error) {
      handleError(error, 'AUTH GET');
    }
  },

  post: async (endpoint, body) => {
    let token = localStorage.getItem('token')||""

    try {
      return await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(body),
      });
    } catch (error) {
      handleError(error, 'AUTH POST');
    }
  },

  put: async (endpoint, body) => {
    let token = localStorage.getItem('token')||""

    try {
      return await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(body),
      });
    } catch (error) {
      handleError(error, 'AUTH PUT');
    }
  },

  delete: async (endpoint) => {
    let token = localStorage.getItem('token')||""

    try {
      return await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token,
        },
      });
    } catch (error) {
      handleError(error, 'AUTH DELETE');
    }
  },
};

// Response handler
const handleResponse = async (response) => {
  if (!response?.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Error handler
const handleError = (error, method) => {
  console.error(`Error in ${method} request:`, error.message);
  throw error;
};