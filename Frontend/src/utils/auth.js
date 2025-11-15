// Token storage and retrieval utilities

export const getToken = () => {
  return localStorage.getItem('accessToken');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

export const setToken = (token) => {
  localStorage.setItem('accessToken', token);
};

export const setRefreshToken = (token) => {
  localStorage.setItem('refreshToken', token);
};

export const removeToken = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('username');
};

export const setUserInfo = (accessToken, refreshToken = null) => {
  if (accessToken) {
    try {
      // Decode JWT token to extract user info
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      setToken(accessToken);
      if (refreshToken) {
        setRefreshToken(refreshToken);
      }
      localStorage.setItem('userRole', payload.role || 'regular');
      localStorage.setItem('username', payload.username || '');
      return payload;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  return null;
};

export const getUserRole = () => {
  return localStorage.getItem('userRole') || 'regular';
};

export const getUsername = () => {
  return localStorage.getItem('username') || '';
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const isAdmin = () => {
  return getUserRole() === 'admin';
};

