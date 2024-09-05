import { useState, useEffect, useRef } from 'react';
import book from '../../assets/book.svg';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { logout } from '../../slices/authSlice';

const Navbar = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: any) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownVisible(false);
            }
        }
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    })

    const handleLogout = () => {
        dispatch(logout());
    }

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    }

    return (
        <div className="bg-sky-300 p-4 relative z-50">
            <div className='mx-auto max-w-8xl px-5'>
                <div className="flex items-center justify-between">
                    {/* Logo on the left */}
                    <div className="text-black text-3xl font-semibold">
                        <a href="/dashboard" className="flex items-center gap-3"><img src={book} alt="Logo" /><span className='logo'>SMS<span className='text-xs pl-1'>By OUTDATA</span></span></a>
                    </div>

                    {/* Links on the right */}
                    {isAuthenticated && (
                        <div className="relative" ref={dropdownRef}>
                            <span className='text-black bg-sky-700 px-[9px] py-1 rounded-full cursor-pointer' data-testid="dropdownNavMenu" onClick={toggleDropdown}><i className='fa-solid fa-user'></i></span>
                            {dropdownVisible && (
                                <ul
                                    id="dropdown"
                                    className="absolute right-0 mt-2 w-48 z-[200] bg-white border border-gray-200 rounded shadow-lg divide-y"
                                >
                                    <>
                                        <li className="px-4 py-2  hover:bg-gray-100">
                                            <p className='font-medium uppercase text-xs'>Account</p>
                                            <div className='pl-2 flex flex-col py-1'>
                                                <span className='font-medium text-sm'>{user?.name}</span>
                                                <span className='text-sm'>{user?.email}</span>
                                            </div>
                                        </li>
                                        <li className="px-4 py-2 hover:bg-gray-100">
                                            <a className='cursor-pointer' onClick={handleLogout}>Log out</a>
                                        </li>
                                    </>
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Navbar;