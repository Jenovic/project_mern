import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStudentsSvc } from '../../services/students';
import { loadStudents } from '../../slices/studentSlice';
import { setAlert } from '../../slices/alertSlice';
import { v4 as uuidv4 } from 'uuid';
import type { RootState } from '../../store';

const StudentList = () => {
    const dispatch = useDispatch();
    const students = useSelector((state: RootState) => state.students.students);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const loadStudentList = async () => {
            try {
                const res = await getStudentsSvc(page);
                dispatch(loadStudents(res.data.students));
                setTotalPages(res.data.pages);
            } catch (error: any) {
                const message = error.msg;
                dispatch(setAlert({ id: uuidv4(), message: message, type: 'error' }));
            }
        }
        loadStudentList();
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

    return (
        <div className='border-2 p-5 rounded'>
            <h1 className='font-semibold uppercase pb-2'>Students</h1>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr className='bg-sky-700 text-white'>
                            <th scope="col" className="px-3 py-3">#</th>
                            <th scope="col" className="px-3 py-3">Name</th>
                            <th scope="col" className="px-3 py-3">Middlename</th>
                            <th scope="col" className="px-3 py-3">Surname</th>
                            <th scope="col" className="px-3 py-3">DOB</th>
                            <th scope="col" className="px-3 py-3">Address</th>
                            <th scope="col" className="px-3 py-3">Phone No.</th>
                            <th scope="col" className="px-3 py-3">Responsibles</th>
                        </tr>
                    </thead>
                    <tbody className={`[&>*:nth-child(${1})]:bg-sky-100`}>
                        {students.map((student, idx) => (
                            <tr key={student.name} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 table-shadow">
                                <td className="px-3">
                                    <span className='flex items-center relative'>
                                        <span className='pr-2'>{(page - 1) * 10 + idx + 1}</span>
                                        <i className="fa-regular fa-pen-to-square text-lg px-2 py-3 cursor-pointer hover:bg-sky-500 hover:text-white"></i>
                                    </span>
                                </td>
                                <td className="px-3">{student.name}</td>
                                <td className="px-3">{student.middleName ? student.middleName : '- -'}</td>
                                <td className="px-3">{student.surname}</td>
                                <td className="px-3">{new Date(student.dob).toLocaleDateString()}</td>
                                <td className="px-3">{student.address}</td>
                                <td className="px-3">{student.phoneNumber ? student.phoneNumber : '- -'}</td>
                                <td className="px-3">
                                    {student.responsables.map((responsable) => (
                                        <div key={responsable.name}>
                                            {responsable.name} {responsable.surname} ({responsable.relationshipToStudent})
                                        </div>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-between mt-4">
                <button
                    className="px-4 py-2 bg-gray-300 rounded"
                    onClick={handlePreviousPage}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <button
                    className="px-4 py-2 bg-gray-300 rounded"
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default StudentList