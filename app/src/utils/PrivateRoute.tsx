import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import type { RootState } from '../store';
import Loader from '../components/Loader';

interface PrivateRouteProps {
  element: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  if (loading) {
    // Optionally, return a loading indicator while checking authentication
    return <Loader />;
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;



