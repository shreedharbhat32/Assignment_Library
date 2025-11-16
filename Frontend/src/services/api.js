import { getToken, removeToken } from '../utils/auth';

// Use environment variable for API base URL, fallback to relative path for local development
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api/v1/user';

// Helper function for making API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = token;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle non-JSON responses
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text || 'An error occurred' };
      }
    }

    if (response.status === 401 || response.status === 403) {
      // Unauthorized or Forbidden - remove token and redirect to login
      removeToken();
      window.location.href = '/login';
      throw new Error(data.message || 'Unauthorized access');
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || 'An error occurred');
    }

    return data;
  } catch (error) {
    // Handle network errors (CORS, connection issues, etc.)
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Please check your network connection and ensure the backend is running.');
    }
    // Re-throw other errors
    throw error;
  }
};

// Authentication APIs
export const registerUser = async (userData) => {
  return apiRequest('/register-user', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const loginUser = async (username, password) => {
  // Login doesn't require a token, so make a direct request
  try {
    const response = await fetch(`${API_BASE_URL}/login-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    // Handle non-JSON responses
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text || 'An error occurred' };
      }
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Login failed');
    }

    return data;
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Please check your network connection and ensure the backend is running.');
    }
    throw error;
  }
};

// Book APIs
export const readBook = async (bookId, title = '') => {
  // Use query parameters instead of body for GET requests (standard RESTful approach)
  const bookIdStr = String(bookId || '').trim();
  
  if (!bookIdStr) {
    throw new Error('Book ID is required');
  }
  
  // Encode bookId for URL
  const encodedBookId = encodeURIComponent(bookIdStr);
  
  // Build URL with query parameter
  const url = `${API_BASE_URL}/library-main/read-book?bookId=${encodedBookId}`;
  
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = token;
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });
    
    // Handle non-JSON responses
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text || 'An error occurred' };
      }
    }

    if (response.status === 401 || response.status === 403) {
      removeToken();
      window.location.href = '/login';
      throw new Error(data.message || 'Unauthorized access');
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || 'An error occurred');
    }

    return data;
  } catch (error) {
    // Handle network errors (CORS, connection issues, etc.)
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Please check your network connection and ensure the backend is running.');
    }
    throw error;
  }
};

export const addBook = async (bookData) => {
  return apiRequest('/library-main/add-book', {
    method: 'POST',
    body: JSON.stringify(bookData),
  });
};

export const updateBook = async (bookId, updation) => {
  return apiRequest('/library-main/update-book', {
    method: 'PUT',
    body: JSON.stringify({ bookId, updation }),
  });
};

export const deleteBook = async (title, bookId) => {
  return apiRequest('/library-main/delete-book', {
    method: 'DELETE',
    body: JSON.stringify({ title, bookId }),
  });
};

export const getAllBooks = async () => {
  return apiRequest('/library-main/get-all-books', {
    method: 'GET',
  });
};

export const getAllUsers = async () => {
  return apiRequest('/users/get-all-users', {
    method: 'GET',
  });
};

export const updateUserRole = async (userId, role) => {
  return apiRequest('/users/update-role', {
    method: 'PUT',
    body: JSON.stringify({ userId, role }),
  });
};

