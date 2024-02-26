import React from 'react';
import { Link } from 'react-router-dom';
import book from '../assets/book.svg';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { logout } from '../slices/authSlice';

const Navbar = () => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
    }

    return (
        <nav className="bg-sky-300  p-4 relative z-50">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo on the left */}
                <div className="text-black text-3xl font-semibold">
                    <a href="/" className="flex items-center gap-3"><img src={book} alt="Logo" />SMS</a>
                </div>

                {/* Links on the right */}
                <ul className="flex gap-6 prose-sys prose-a:text-black text-xl hover:prose-a:underline">
                    {!isAuthenticated && <li><Link to="/login">Login</Link></li>}
                    {isAuthenticated && <li><Link to="/dashboard" >Dashboard</Link></li>}
                    {isAuthenticated && <li><Link to="/my-account" >Account</Link></li>}
                    {isAuthenticated && <li><a onClick={handleLogout}>Logout</a></li>}
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;