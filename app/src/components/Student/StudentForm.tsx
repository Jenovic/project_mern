import React, { useState } from 'react';

interface StudentFormProps {
    student: any;
    onSubmit: (data: any) => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ student, onSubmit }) => {
    const [formData, setFormData] = useState(student);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='grid md:grid-cols-2 md:gap-x-5'>
                <div className="mb-4 grid md:grid-cols-12 items-center">
                    <label className="block col-span-3 text-gray-700 text-sm text-left font-bold mb-2" htmlFor="name">Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
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
                        Surname
                    </label>
                    <input
                        id="surname"
                        name="surname"
                        type="text"
                        value={formData.surname}
                        onChange={handleChange}
                        className=" col-span-9 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4 grid md:grid-cols-12 items-center">
                    <label className="block col-span-3 text-gray-700 text-sm text-left font-bold mb-2" htmlFor="dob">
                        Date of Birth
                    </label>
                    <input
                        id="dob"
                        name="dob"
                        type="date"
                        value={formData.dob}
                        onChange={handleChange}
                        className=" col-span-9 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4 grid md:grid-cols-12 items-center">
                    <label className="block col-span-3 text-gray-700 text-sm text-left font-bold mb-2" htmlFor="address">
                        Address
                    </label>
                    <input
                        id="address"
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleChange}
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
