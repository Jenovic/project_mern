import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAlert } from '../slices/alertSlice';
import type { RootState } from '../store';
import { loginSuccess, loginError, loadUser } from '../slices/authSlice';
import { v4 as uuidv4 } from 'uuid';
import { loginSvc, loadUserSvc } from '../services/auth';
import { getLocationsSvc } from '../services/locations';
import { loadLocations } from '../slices/locationSlice';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async () => {
        try {
            const { email, password } = formData;
            const res = await loginSvc(email, password);
            dispatch(loginSuccess({ token: res.data.token }));
            const user = await loadUserSvc();
            dispatch(loadUser(user.data));
            const locations = await getLocationsSvc();
            dispatch(loadLocations(locations.data));
        } catch (error: any) {
            dispatch(loginError());
            error.response.data.errors.forEach((err: { msg: string }) => {
                dispatch(setAlert({ id: uuidv4(), message: err.msg, type: 'error' }));
            });
        }
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        handleLogin();
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    return (
        <section className='max-w-8xl mx-auto'>
            <div className='px-5 flex justify-center items-center h-screen'>
                <div className="lg:w-1/2 p-8 border rounded bg-white">
                    <h2 className="text-2xl text-center mb-4">Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="block w-full border rounded py-2 px-3 text-gray-700 mt-1 focus:outline-none focus:ring focus:border-blue-300"
                            />
                        </div>
                        <div className="mb-4 relative">
                            <label className="block text-sm font-medium text-gray-700">Password:</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                className="block w-full border rounded py-2 px-3 text-gray-700 mt-1 focus:outline-none focus:ring focus:border-blue-300"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-3 top-8 text-gray-600 focus:outline-none"
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        <div className="mt-12">
                            <button
                                type="submit"
                                className="w-full bg-sky-400 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                    <p className='mt-6 italic'>Don't have an account? Contact the administrator</p>
                </div>
            </div>
        </section>
    );
};

export default Login;
