import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateStudentSvc } from '../../services/students';
import { setAlert } from '../../slices/alertSlice';
import { v4 as uuidv4 } from 'uuid';

interface StudentFormProps {
    student: any;
    onSubmit: (data: any) => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ student, onSubmit }) => {

    const dispatch = useDispatch();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const initialFormData = {
        ...student,
        dob: student.dob ? formatDate(student.dob) : ''
    };

    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await updateStudentSvc(student._id, formData);
            dispatch(setAlert({ id: uuidv4(), message: 'Student updated successfully', type: 'success' }));
            console.log('Student updated successfully:', response.data);
        } catch (error: any) {
            const message = error.msg;
            dispatch(setAlert({ id: uuidv4(), message: message, type: 'error' }));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='grid md:grid-cols-2 md:gap-x-5'>
                <div className="mb-4 grid md:grid-cols-12 items-center">
                    <label className="block col-span-3 text-gray-700 text-sm text-left font-bold mb-2" htmlFor="name">
                        Name <span className='text-red-500'>*</span>
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className=" col-span-9 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4 grid md:grid-cols-12 items-center">
                    <label className="block col-span-3 text-gray-700 text-sm text-left font-bold mb-2" htmlFor="middleName">
                        Middle Name
                    </label>
                    <input
                        id="middleName"
                        name="middleName"
                        type="text"
                        value={formData.middleName}
                        onChange={handleChange}
                        className=" col-span-9 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4 grid md:grid-cols-12 items-center">
                    <label className="block col-span-3 text-gray-700 text-sm text-left font-bold mb-2" htmlFor="surname">
                        Surname <span className='text-red-500'>*</span>
                    </label>
                    <input
                        id="surname"
                        name="surname"
                        type="text"
                        value={formData.surname}
                        onChange={handleChange}
                        required
                        className=" col-span-9 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4 grid md:grid-cols-12 items-center">
                    <label className="block col-span-3 text-gray-700 text-sm text-left font-bold mb-2" htmlFor="dob">
                        Date of Birth <span className='text-red-500'>*</span>
                    </label>
                    <input
                        id="dob"
                        name="dob"
                        type="date"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                        className=" col-span-9 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4 grid md:grid-cols-12 items-center">
                    <label className="block col-span-3 text-gray-700 text-sm text-left font-bold mb-2" htmlFor="address">
                        Address <span className='text-red-500'>*</span>
                    </label>
                    <input
                        id="address"
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className=" col-span-9 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4 grid md:grid-cols-12 items-center">
                    <label className="block col-span-3 text-gray-700 text-sm text-left font-bold mb-2" htmlFor="phoneNumber">
                        Phone Number
                    </label>
                    <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="text"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className=" col-span-9 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

            </div>
            <div>
                <div className="flex items-center justify-end gap-5">
                    <button
                        className="bg-sky-700 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Save
                    </button>
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    );
};

export default StudentForm;
