import { useAuthentication } from './AuthContext';

export const useApi = () => {
  const { getAuthHeaders, logout } = useAuthentication();

  const apiCall = async (url, options = {}) => {
    try {
      const authHeaders = getAuthHeaders();
      
      const response = await fetch(`http://localhost:3001${url}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
          ...options.headers,
        },
      });

      // If unauthorized, logout user
      if (response.status === 401) {
        logout();
        throw new Error('Session expired. Please log in again.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  };

  return { apiCall };
};