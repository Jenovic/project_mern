import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import splash from '../assets/splash.jpg';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const SplashScreen = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const divStyle = { backgroundImage: `url(${splash})` };

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    return (
        <section style={divStyle} className='absolute left-0 top-0 w-full h-screen bg-cover bg-no-repeat bg-center flex flex-col justify-center items-center'>
            <p className='text-3xl text-white'>Welcome to the School Management System, Please login below to continue</p>
            <Link to="/login" className="text-black text-2xl bg-sky-300 px-5 py-3 mt-5 rounded-md font-semibold hover:bg-sky-500">Login</Link>
        </section>
    );
}

export default SplashScreen;

