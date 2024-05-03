import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStudentsSvc } from '../../services/students';
import { loadStudents } from '../../slices/studentSlice';
import { setAlert } from '../../slices/alertSlice';
import { v4 as uuidv4 } from 'uuid';
import type { RootState } from '../../store';

const StudentList = () => {
    const dispatch = useDispatch();
    const students = useSelector((state: RootState) => state.students.students);

    useEffect(() => {
        const loadStudentList = async () => {
            try {
                const res = await getStudentsSvc();
                dispatch(loadStudents(res.data));
            } catch (error: any) {
                const message = error.msg;
                dispatch(setAlert({ id: uuidv4(), message: message, type: 'error' }));
            }
        }
        loadStudentList();
    }, []);

    return (
        <div className=' border p-5 rounded'>
            <h1>Students</h1>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
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
                                Responsibles
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => {
                            return (
                                <tr key={student.name} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="px-6 py-4">
                                        {student.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {student.middleName ? student.middleName : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {student.surname}
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(student.dob).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {student.address}
                                    </td>
                                    <td className="px-6 py-4">
                                        {student.phoneNumber ? student.phoneNumber : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {student.responsables.map((responsable) => (
                                            <div key={responsable.name}>
                                                {responsable.name} {responsable.surname} ({responsable.relationshipToStudent})
                                            </div>
                                        ))}
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

export default StudentList