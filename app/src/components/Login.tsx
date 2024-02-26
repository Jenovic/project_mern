import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAlert } from '../slices/alertSlice';
import type { RootState } from '../store';
import { loginSuccess, loginError, loadUser } from '../slices/authSlice';
import { v4 as uuidv4 } from 'uuid';
import { loginSvc, loadUserSvc } from '../services/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleEmailChange = (e: any) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: any) => {
        setPassword(e.target.value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            const res = await loginSvc(email, password);
            dispatch(loginSuccess({ token: res.data.token }));
            const user = await loadUserSvc();
            dispatch(loadUser(user.data));
        } catch (error: any) {
            dispatch(loginError());
            const errors = error.response.data.errors;
            errors.forEach((error: any) => {
                const message = error.msg;
                dispatch(setAlert({ id: uuidv4(), message: message, type: 'error' }));
            });
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated]);

    return (
        <section className='max-w-7xl mx-auto h-screen flex justify-center items-center'>

            <div className="w-1/2 p-8 border rounded bg-white">
                <h2 className="text-2xl text-center mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                            className="block w-full border rounded py-2 px-3 text-gray-700 mt-1 focus:outline-none focus:ring focus:border-blue-300"
                        />
                    </div>
                    <div className="mb-4 relative">
                        <label className="block text-sm font-medium text-gray-700">Password:</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={handlePasswordChange}
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
        </section>
    );
};

export default Login;
