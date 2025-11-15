import { getToken, removeToken } from '../utils/auth';

// Use relative URL when proxy is configured in package.json
// This will proxy requests from React dev server (localhost:3000) to backend (localhost:5000)
const API_BASE_URL = '/api/v1/user';

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
      throw new Error('Cannot connect to server. Please ensure the backend is running on http://localhost:5000 and CORS is enabled.');
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
      throw new Error('Cannot connect to server. Please ensure the backend is running on http://localhost:5000 and CORS is enabled.');
    }
    throw error;
  }
};

// Book APIs
export const readBook = async (bookId, title = '') => {
  // Backend expects GET with body containing both title and bookId
  // Using XMLHttpRequest as a workaround since Fetch API doesn't allow body with GET
  return new Promise((resolve, reject) => {
    const token = getToken();
    
    // Ensure bookId is a string and trim whitespace
    const bookIdStr = String(bookId || '').trim();
    const titleStr = title ? String(title).trim() : bookIdStr;
    
    if (!bookIdStr) {
      reject(new Error('Book ID is required'));
      return;
    }
    
    // Prepare request body
    const requestBody = {
      title: titleStr,
      bookId: bookIdStr
    };
    
    const bodyString = JSON.stringify(requestBody);
    
    // Debug: Log what we're sending (remove in production)
    console.log('Sending readBook request:', { bookId: bookIdStr, body: requestBody });
    
    const xhr = new XMLHttpRequest();
    
    // Set up the request BEFORE setting headers
    xhr.open('GET', `${API_BASE_URL}/library-main/read-book`, true);
    
    // IMPORTANT: Set Content-Type header BEFORE opening the connection
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    if (token) {
      xhr.setRequestHeader('Authorization', token);
    }
    
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        try {
          // Debug: Log response
          console.log('Response status:', xhr.status);
          console.log('Response text:', xhr.responseText);
          
          const contentType = xhr.getResponseHeader('content-type');
          let data;
          
          if (contentType && contentType.includes('application/json')) {
            data = JSON.parse(xhr.responseText);
          } else {
            try {
              data = JSON.parse(xhr.responseText);
            } catch {
              data = { message: xhr.responseText || 'An error occurred' };
            }
          }
          
          if (xhr.status === 401 || xhr.status === 403) {
            removeToken();
            window.location.href = '/login';
            reject(new Error(data.message || 'Unauthorized access'));
            return;
          }
          
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(data);
          } else {
            reject(new Error(data.message || data.error || 'An error occurred'));
          }
        } catch (error) {
          reject(error);
        }
      }
    };
    
    xhr.onerror = function() {
      reject(new Error('Cannot connect to server. Please ensure the backend is running on http://localhost:5000 and CORS is enabled.'));
    };
    
    // Send the body - XMLHttpRequest should handle GET with body
    xhr.send(bodyString);
  });
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

