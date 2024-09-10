import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import type { RootState } from '../store';
import { loadUserSvc } from '../services/auth'; // Service to load user info
import { loadUser, setLoading } from '../slices/authSlice';  // Actions to update auth state
import Loader from '../components/Loader';

interface PrivateRouteProps {
  element: JSX.Element;
  requiredRole?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, requiredRole }) => {
  const { isAuthenticated, loading, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      if (localStorage.token) {
        try {
          const user = await loadUserSvc(); // Make the API call or check auth
          dispatch(loadUser(user.data)); // Dispatch action to set user and authenticated state
        } catch (error) {
          console.log('Error loading user:', error);
          dispatch(setLoading(false)); // Ensure loading is set to false if there's an error
        }
      } else {
        dispatch(setLoading(false)); // No token, stop loading
      }
    };

    if (loading) {
      checkAuth(); // Only check auth if loading is true
    }
  }, [loading, dispatch]);

  if (loading) {
    return <Loader />; // Show loading spinner while checking authentication
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" />; // or redirect to a "Not authorized" page
  }

  return element;
};

export default PrivateRoute;
