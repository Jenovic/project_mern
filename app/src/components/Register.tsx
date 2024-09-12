import { useState, useEffect, useCallback, ChangeEvent, FormEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { registerUserSvc, updateUserSvc, getUserSvc } from '../services/users';
import { useQuery } from '../hooks/hooks';
import { decryptFn } from '../utils/helpers';
import { setAlert } from '../slices/alertSlice';
import { v4 as uuidv4 } from 'uuid';
import DOMPurify from 'dompurify';

const Register = () => {
    const query = useQuery();
    const data = query.get('data') || '';
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        password: '',
        password2: '',
        role: '',
    });
    const [errors, setErrors] = useState({ password: '', password2: '' });
    const [userAdded, setUserAdded] = useState(false);
    const [registrationCompleted, setRegistrationCompleted] = useState(false);
    const [regLink, setRegLink] = useState('');
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        const getUser = async (userId: string) => {
            const res = await getUserSvc(userId);
            return res.data;
        }

        const processData = async () => {
            if (data) {
                try {
                    const base64Decoded = atob(data);
                    const decryptedData = decryptFn(base64Decoded);
                    const [id, name, email, role] = decryptedData.split('&');
                    const user = await getUser(id);

                    if (user.registered) {
                        setRegistrationCompleted(true);
                        return;
                    }

                    setFormData({
                        id,
                        name,
                        email,
                        password: '',
                        password2: '',
                        role,
                    });
                } catch (error) {
                    dispatch(setAlert({ id: uuidv4(), message: 'Invalid registration link.', type: 'error' }));
                }
            }
        }
        processData();
    }, [data, dispatch]);

    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const sanitizedValue = DOMPurify.sanitize(e.target.value);
        setFormData((prevFormData) => ({
            ...prevFormData,
            [e.target.name]: sanitizedValue
        }));
    }, []);

    const validatePassword = useCallback((password: string): boolean => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return passwordRegex.test(password);
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const { id, password, password2 } = formData;
        const validationErrors = { password: '', password2: '' };

        if (!isAuthenticated) {
            if (!validatePassword(password)) validationErrors.password = 'Password must contain at least 8 characters, 1 special character, 1 number, and 1 uppercase letter.';

            if (password !== password2) validationErrors.password2 = 'Passwords do not match.';

            if (validationErrors.password || validationErrors.password2) {
                setErrors(validationErrors);
                return;
            }
        }

        try {
            if (isAuthenticated) {
                const res = await registerUserSvc(formData);
                setRegLink(res.data.regLink);
                setUserAdded(true);
            } else {
                await updateUserSvc(id, formData);
                dispatch(setAlert({ id: uuidv4(), message: `registration successfull`, type: 'success' }));
                setRegistrationCompleted(true);
            }
        } catch (error) {
            dispatch(setAlert({
                id: uuidv4(),
                message: 'An error occurred. Please try again.',
                type: 'error'
            }));
        }
    }

    if (isAuthenticated && userAdded) {
        return (
            <section className='max-w-8xl mx-auto'>
                <div className='px-5 flex justify-center items-center h-screen'>
                    <p className='text-lg'>The user has been added. Send the following registration link to the user to complete the registration: {regLink}</p>
                </div>
            </section>
        )
    }

    if (!isAuthenticated && !data) {
        return (
            <section className='max-w-8xl mx-auto'>
                <div className='px-5 flex justify-center items-center h-screen'>
                    <p className='text-lg'>Invalid registration link. Please contact the administrator</p>
                </div>
            </section>
        )
    }

    if (registrationCompleted) {
        return (
            <section className='max-w-8xl mx-auto'>
                <div className='px-5 flex justify-center items-center h-screen'>
                    <p className='text-lg'>The registartion is completed. please login <a className='text-blue-500 underline' href='/login'>here</a> to begin.</p>
                </div>
            </section>
        )
    }

    return (
        <section className='max-w-8xl mx-auto'>
            <div className='px-5 flex justify-center items-center h-screen'>
                <div className="lg:w-1/2 p-8 border rounded bg-white">
                    <h2 className="text-2xl text-center mb-4">{!isAuthenticated ? 'Set Password' : 'Register'}</h2>
                    <form onSubmit={handleSubmit}>
                        {!isAuthenticated && <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">id:</label>
                            <input
                                type="text"
                                name="id"
                                value={formData.id}
                                onChange={handleInputChange}
                                disabled={data ? true : false}
                                className="block w-full border rounded py-2 px-3 text-gray-700 mt-1 focus:outline-none focus:ring focus:border-blue-300"
                            />
                        </div>}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Fullname:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                disabled={data ? true : false}
                                className="block w-full border rounded py-2 px-3 text-gray-700 mt-1 focus:outline-none focus:ring focus:border-blue-300"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                disabled={data ? true : false}
                                className="block w-full border rounded py-2 px-3 text-gray-700 mt-1 focus:outline-none focus:ring focus:border-blue-300"
                            />
                        </div>
                        <div className="mb-4 relative">
                            <label className="block text-sm font-medium text-gray-700">Role:</label>
                            <select
                                required
                                id="userroles"
                                name="role"
                                value={formData.role || ''}
                                onChange={handleInputChange}
                                disabled={data ? true : false}
                                className="block w-full border rounded py-2 px-3 text-gray-700 mt-1 focus:outline-none focus:ring focus:border-blue-300">
                                <option value="">select ...</option>
                                <option value="superadmin">Superadmin</option>
                                <option value="admin">Admin</option>
                                <option value="staff">Staff</option>
                            </select>
                        </div>
                        {!isAuthenticated &&
                            <>
                                <div className="mb-4 relative">
                                    <label className="block text-sm font-medium text-gray-700">Password:</label>
                                    <input
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        className="block w-full border rounded py-2 px-3 text-gray-700 mt-1 focus:outline-none focus:ring focus:border-blue-300"
                                    />
                                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                                </div>
                                <div className="mb-4 relative">
                                    <label className="block text-sm font-medium text-gray-700">Confirm Password:</label>
                                    <input
                                        name="password2"
                                        type="password"
                                        value={formData.password2}
                                        onChange={handleInputChange}
                                        required
                                        className="block w-full border rounded py-2 px-3 text-gray-700 mt-1 focus:outline-none focus:ring focus:border-blue-300"
                                    />
                                    {errors.password2 && <p className="text-red-500 text-sm">{errors.password2}</p>}
                                </div>
                            </>
                        }
                        <div className="mt-12">
                            <button
                                type="submit"
                                className="w-full bg-sky-400 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300"
                            >
                                {!isAuthenticated ? 'Set Password' : 'Register'}
                            </button>
                        </div>
                    </form>
                    <p className='mt-6 italic'>Not registered yet? Contact the administrator</p>
                </div>
            </div>
        </section>
    )
}

export default Register;