import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';
import Navbar from './components/Navbar';
import SplashScreen from './components/SplashScreen';
import Login from './components/Login';
import Alert from './components/Alert';
import Dashboard from './components/Dashboard/Dashboard';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './slices/authSlice';
import { loadUserSvc } from './services/auth';
import { useDispatch } from 'react-redux';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {

  const dispatch = useDispatch();

  const initialLoad = async () => {
    const user = await loadUserSvc();
    dispatch(loadUser(user.data));
  }

useEffect(() => {
  initialLoad();
}, []);

  return (
    <Router>
      <>
        <Alert />
        <Navbar />
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
}

export default App;
