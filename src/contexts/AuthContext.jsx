// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import apiClient from '../services/apiClient'; // <-- Import our new API client

// 1. Create the Context
const AuthContext = createContext(null);

// 2. Create the Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state

  // 3. Add an effect to check for a token on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      // If we have a token and user data, set the user
      // We are trusting the token is valid. A full app
      // would re-validate it with the server here.
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  // 4. Update the LOGIN function
  const login = async (email, password) => {
    try {
      // Call the backend /api/auth/login endpoint
      const response = await apiClient.post('/auth/login', {
        email: email,
        password: password,
      });

      const { token, user: userData } = response.data;

      // --- Success! ---
      // 1. Save the token to local storage
      localStorage.setItem('authToken', token);
      
      // 2. Save the user data to local storage
      localStorage.setItem('userData', JSON.stringify(userData));

      // 3. Set the user in our state
      setUser(userData);
      
      console.log('Login successful:', userData);
      return userData; // Return user data
      
    } catch (error) {
      // If the API call fails (e.g., 401 Unauthorized)
      console.error('Login failed:', error.response?.data || error.message);
      return null;
    }
  };

  // 5. Update the LOGOUT function
  const logout = () => {
    // Clear user from state
    setUser(null);
    
    // Remove data from local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };
  
  // 6. Create a 'value' object to pass down
  const value = {
    user,
    login,
    logout,
    isAdmin: user?.role === 'Admin', // This logic is still the same!
    isAuthenticated: !!user, // A new handy boolean
    loading, // Pass loading state
  };

  // 7. Return the provider
  // We don't render children until we've checked for a token
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// 3. Create the custom hook (no changes here)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};