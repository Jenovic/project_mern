import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getClassroomsSvc } from '../../services/classrooms';
import { loadClassrooms } from '../../slices/classroomSlice';
import { setAlert } from '../../slices/alertSlice';
import { v4 as uuidv4 } from 'uuid';
import type { RootState } from '../../store';

const ClassroomList = () => {
  const dispatch = useDispatch();
    const classrooms = useSelector((state: RootState) => state.classrooms.classrooms);

    useEffect(() => {
        const loadClassroomList = async () => {
            try {
                const res = await getClassroomsSvc();
                dispatch(loadClassrooms(res.data));
            } catch (error: any) {
                const message = error.msg;
                dispatch(setAlert({ id: uuidv4(), message: message, type: 'error' }));
            }
        }
        loadClassroomList();
    }, []);

    return (
        <div className='border-2 p-5 rounded'>
            <h1 className='font-semibold uppercase pb-2'>Classrooms</h1>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr className='bg-sky-700 text-white'>
                            <th scope="col" className="px-6 py-3">
                                Name
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {classrooms.map((classroom) => {
                            return (
                                <tr key={classroom.name} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="px-6 py-4">
                                        {classroom.name}
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

export default ClassroomList