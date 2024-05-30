import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAlert } from '../../slices/alertSlice';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import type { RootState } from '../../store';
import { getTeachersSvc } from '../../services/teachers';
import { loadTeachers } from '../../slices/teacherSlice';

interface TeacherProps {
    showFull: boolean;
}

const TeacherList: React.FC<TeacherProps> = ({ showFull }) => {
    const dispatch = useDispatch();
    const teachers = useSelector((state: RootState) => state.teachers.teachers);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [rowIndex, setRowIndex] = useState(0);

    useEffect(() => {
        const loadTeacherList = async () => {
            try {
                const res = await getTeachersSvc(page);
                dispatch(loadTeachers(res.data.teachers));
                setTotalPages(res.data.pages);
            } catch (error: any) {
                const message = error.msg;
                dispatch(setAlert({ id: uuidv4(), message: message, type: 'error' }));
            }
        }
        loadTeacherList();
    }, [page]);

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleRowSelect = (idx: number) => {
        setRowIndex(idx);
    }

    const displayedTeachers = showFull ? teachers : teachers.slice(0, 5);

    return (
        <div className='border-2 p-5 rounded'>
            <h1 className="font-semibold uppercase pb-2">Teachers</h1>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr className='bg-sky-700 text-white'>
                            <th scope="col" className="px-3 py-3">#</th>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Middlename</th>
                            <th scope="col" className="px-6 py-3">Surname</th>
                            <th scope="col" className="px-6 py-3">DOB</th>
                            <th scope="col" className="px-6 py-3">Address</th>
                            <th scope="col" className="px-6 py-3">Phone No.</th>
                            <th scope="col" className="px-6 py-3">email</th>
                        </tr>
                    </thead>
                    <tbody className={`[&>*:nth-child(${rowIndex + 1})]:bg-sky-100`}>
                        {displayedTeachers.map((teacher, idx) => {
                            return (
                                <tr key={teacher.name} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 table-shadow" onClick={() => handleRowSelect(idx)}>
                                    <td className="px-3">
                                        <span className='flex items-center relative'>
                                            <span className='pr-2'>{(page - 1) * 10 + idx + 1}</span>
                                            <i className="fa-regular fa-pen-to-square text-lg px-2 py-3 cursor-pointer hover:bg-sky-500 hover:text-white"></i>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{teacher.name}</td>
                                    <td className="px-6 py-4">{teacher.middleName ? teacher.middleName : '-'}</td>
                                    <td className="px-6 py-4">{teacher.surname}</td>
                                    <td className="px-6 py-4">{new Date(teacher.dob).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{teacher.address}</td>
                                    <td className="px-6 py-4">{teacher.phoneNumber ? teacher.phoneNumber : '-'}</td>
                                    <td className="px-6 py-4">{teacher.email ? teacher.email : '-'}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            {showFull &&
                <div className="flex justify-center mt-4 gap-3">
                    <button
                        className={`px-4 py-2 ${page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-sky-300 cursor-pointer'} rounded`}
                        onClick={handlePreviousPage}
                        disabled={page === 1}
                    >
                        <i className="fa-solid fa-angle-left"></i>
                    </button>
                    <button
                        className={`px-4 py-2 ${page === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-sky-300 cursor-pointer'} rounded`}
                        onClick={handleNextPage}
                        disabled={page === totalPages}
                    >
                        <i className="fa-solid fa-angle-right"></i>
                    </button>
                </div>
            }
            {!showFull &&
                <div className='mt-5 flex justify-end'>
                    <Link to="/teachers" className="text-black inline-block text-md bg-sky-300 px-4 py-2 rounded-md font-semibold hover:bg-sky-500">
                        <span className='flex items-center gap-1'>See more <i className="fa-solid fa-angles-right"></i></span>
                    </Link>
                </div>
            }
        </div>
    )
}

export default TeacherList