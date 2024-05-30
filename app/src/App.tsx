import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { loadUser } from './slices/authSlice';
import { loadUserSvc } from './services/auth';
import { useDispatch } from 'react-redux';
import PrivateRoute from './utils/PrivateRoute';
import Navbar from './components/Nav/Navbar';
import SplashScreen from './components/SplashScreen';
import Login from './components/Login';
import Alert from './components/Alert';
import Dashboard from './components/Dashboard/Dashboard';
import Students from './components/Student/Students';
import Teachers from './components/Teacher/Teachers';
import setAuthToken from './utils/setAuthToken';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {

  const dispatch = useDispatch();

  const initialLoad = async () => {
    if (localStorage.token) {
      const user = await loadUserSvc();
      dispatch(loadUser(user.data));
    }
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
          <Route path="/students" element={<PrivateRoute />}>
            <Route path="/students" element={<Students />} />
          </Route>
          <Route path="/teachers" element={<PrivateRoute />}>
            <Route path="/teachers" element={<Teachers />} />
          </Route>
        </Routes>
      </>
    </Router>
  );
}

export default App;
