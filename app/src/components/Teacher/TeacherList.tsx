import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAlert } from '../../slices/alertSlice';
import { v4 as uuidv4 } from 'uuid';
import type { RootState } from '../../store';
import { getTeachersSvc } from '../../services/teachers';
import { loadTeachers } from '../../slices/teacherSlice';


const TeacherList = () => {
    const dispatch = useDispatch();
    const teachers = useSelector((state: RootState) => state.teachers.teachers);

    useEffect(() => {
        const loadTeacherList = async () => {
            try {
                const res = await getTeachersSvc();
                dispatch(loadTeachers(res.data));
            } catch (error: any) {
                const message = error.msg;
                dispatch(setAlert({ id: uuidv4(), message: message, type: 'error' }));
            }
        }
        loadTeacherList();
    }, []);
  return (
    <div className='border-2 p-5 rounded'>
            <h1 className="font-semibold uppercase pb-2">Teachers</h1>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr className='bg-sky-700 text-white'>
                            <th scope="col" className="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Middlename
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Surname
                            </th>
                            <th scope="col" className="px-6 py-3">
                                DOB
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Address
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Phone No.
                            </th>
                            <th scope="col" className="px-6 py-3">
                                email
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.map((teacher) => {
                            return (
                                <tr key={teacher.name} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="px-6 py-4">
                                        {teacher.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {teacher.middleName ? teacher.middleName : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {teacher.surname}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(teacher.dob).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {teacher.address}
                                    </td>
                                    <td className="px-6 py-4">
                                        {teacher.phoneNumber ? teacher.phoneNumber : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {teacher.email ? teacher.email : '-'}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

        </div>
  )
}

export default TeacherList