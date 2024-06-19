import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStudentSvc, updateStudentSvc } from '../../services/students';
import { setAlert } from '../../slices/alertSlice';
import { setLoading, updateStudent, setUpdateDisabled, setSelectedStudent } from '../../slices/studentSlice';
import { setShowFormModal } from '../../slices/globalSlice';
import { v4 as uuidv4 } from 'uuid';
import type { RootState } from '../../store';
import { determineType } from '../../utils/helpers';

interface Field {
    name: string;
    type: string;
    required: boolean;
}

const StudentCard = () => {

    const dispatch = useDispatch();
    const { updateDisabled, selectedStudent, studentLoading } = useSelector((state: RootState) => state.students);
    const { showFormModal } = useSelector((state: RootState) => state.global);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const initialFormData = selectedStudent
        ? {
            ...selectedStudent,
            dob: selectedStudent.dob ? formatDate(selectedStudent.dob) : '',
        }
        : {};

    const [formData, setFormData] = useState(initialFormData);
    const [fields, setFields] = useState<Field[]>([]);

    useEffect(() => {
        const getStudentData = async () => {
            if (selectedStudent) {
                try {
                    const response = await getStudentSvc(selectedStudent._id);
                    const filteredFields = response.data.fieldTypes.filter(
                        (field: Field) => field.name !== '__v' && field.name !== 'responsables'
                    );
                    setFields(filteredFields);
                } catch (error: any) {
                    const message = error.msg;
                    dispatch(setAlert({ id: uuidv4(), message: message, type: 'error' }));
                }
            }
        }
        getStudentData();
    }, [selectedStudent, updateDisabled, showFormModal]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        dispatch(setUpdateDisabled(false));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await updateStudentSvc(selectedStudent._id, formData);
            dispatch(setAlert({ id: uuidv4(), message: 'Student updated successfully', type: 'success' }));
            dispatch(updateStudent(response.data));
            dispatch(setShowFormModal(false));
        } catch (error: any) {
            const message = error.msg;
            dispatch(setAlert({ id: uuidv4(), message: message, type: 'error' }));
        } finally {
            dispatch(setLoading(true));
            dispatch(setUpdateDisabled(true));
        }
    };

    const handleCloseModal = () => {
        dispatch(setShowFormModal(false));
        dispatch(setSelectedStudent(null));
    };

    return (
        <>
            {showFormModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white">
                        <div className="text-center">
                            <div className="flex items-center justify-between px-5">
                                <span className='font-bold uppercase'>(STUDENT) {selectedStudent.name} {selectedStudent.middleName} {selectedStudent.surname} </span>
                                <button
                                    className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700"
                                    onClick={handleCloseModal}
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                            <div className="px-5 py-5">
                                <form onSubmit={handleSubmit}>
                                    <div className='grid lg:grid-cols-2 lg:gap-x-5'>
                                        {fields.map((field) => (
                                            <div key={field.name} className="mb-4 grid md:grid-cols-12 items-center">
                                                <label className="block col-span-3 text-gray-700 text-sm text-left font-bold mb-2" htmlFor={field.name}>
                                                    {field.name}
                                                    <span className='text-red-500'>{field.required && ' *'}</span>
                                                </label>
                                                <input
                                                    id={field.name}
                                                    name={field.name}
                                                    type={determineType(field.type)}
                                                    value={field.type === 'Date' ? (formData[field.name] || '').split('T')[0] : (formData[field.name] || '')}
                                                    onChange={handleChange}
                                                    readOnly={field.name === '_id' || field.name === 'dateCreated' || field.name === 'dateModified'}
                                                    className={`col-span-9 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none
                                     focus:shadow-outline ${field.name === '_id' || field.name === 'dateCreated' || field.name === 'dateModified' ? 'bg-gray-200 cursor-not-allowed' : ''
                                                        }`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-end gap-5">
                                            <button
                                                className={`bg-sky-700 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${updateDisabled ? 'bg-gray-400' : ''}`}
                                                type="submit"
                                                disabled={updateDisabled}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                onClick={handleCloseModal}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
};

export default StudentCard;
