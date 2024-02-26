import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';
import Navbar from './components/Navbar';
import SplashScreen from './components/SplashScreen';
import Login from './components/Login';
import Alert from './components/Alert';
import Dashboard from './components/Dashboard/Dashboard';
import setAuthToken from './utils/setAuthToken';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  return (
    <Router>
      <>
        <Alert />
        <Navbar />
        <SplashScreen />
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </>
    </Router>
  );
  return (
    <SplashScreen />
  )
}

export default App;
