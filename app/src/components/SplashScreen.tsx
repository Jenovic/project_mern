import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import splash from '../assets/splash.jpg';

const SplashScreen = () => {
    const navigate = useNavigate();
    const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
    const divStyle = { backgroundImage: `url(${splash})` };

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <section style={divStyle} className='absolute left-0 top-0 w-full h-screen bg-cover bg-no-repeat bg-center flex flex-col justify-center items-center'>
            <p className='text-3xl text-white text-center font-medium'>Welcome to the School Management System <br /> Please login to begin.</p>
            <button onClick={handleLoginClick} className="text-black text-2xl bg-sky-300 px-5 py-3 mt-5 rounded-md font-semibold hover:bg-sky-500">Login</button>
        </section>
    );
}

export default SplashScreen;

