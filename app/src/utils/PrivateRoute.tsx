import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import type { RootState } from '../store';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  return isAuthenticated && !loading ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;


