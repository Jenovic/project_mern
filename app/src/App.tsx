import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { loadUser } from './slices/authSlice';
import { loadLocations } from './slices/locationSlice';
import { loadUserSvc } from './services/auth';
import { getLocationsSvc } from './services/locations';
import { useDispatch } from 'react-redux';
import { setAlert } from './slices/alertSlice';
import PrivateRoute from './utils/PrivateRoute';
import Navbar from './components/Nav/Navbar';
import SplashScreen from './components/SplashScreen';
import Login from './components/Login';
import Register from './components/Register';
import Alert from './components/Alert';
import Dashboard from './components/Dashboard/Dashboard';
import Students from './components/Student/Students';
import Teachers from './components/Teacher/Teachers';
import Classrooms from './components/Classroom/Classrooms';
import Users from './components/User/Users';
import setAuthToken from './utils/setAuthToken';
import { v4 as uuidv4 } from 'uuid';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    const initialLoad = async () => {
      if (localStorage.token) {
        try {
          const user = await loadUserSvc();
          const locations = await getLocationsSvc();

          dispatch(loadUser(user.data));
          dispatch(loadLocations(locations.data));

        } catch (error: any) {
          console.log(error);
          const message = error.message;
          dispatch(setAlert({ id: uuidv4(), message: 'Your session expired, please log in.', type: 'error' }));
        }
      }
    }

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
          <Route path="/register" element={<Register />} />
          <Route path="/setPassword" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/students" element={<PrivateRoute element={<Students />} />} />
          <Route path="/teachers" element={<PrivateRoute element={<Teachers />} />} />
          <Route path="/classrooms" element={<PrivateRoute element={<Classrooms />} />} />
          <Route path="/users" element={<PrivateRoute element={<Users />} requiredRole="superadmin" />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
