import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getStudentSvc, updateStudentSvc } from '../../services/students';
import { setAlert } from '../../slices/alertSlice';
import { v4 as uuidv4 } from 'uuid';

interface StudentCardProps {
    student: any;
    onSubmit: (data: any) => void;
    onClose: () => void;
}

interface Field {
    name: string;
    type: string;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onSubmit, onClose }) => {

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
    const [fields, setFields] = useState<Field[]>([]);

    useEffect(() => {
        const getStudentData = async () => {
            try {
                const response = await getStudentSvc(student._id);
                const filteredFields = response.data.fieldTypes.filter(
                    (field: Field) => field.name !== '__v' && field.name !== 'responsables'
                );
                setFields(filteredFields);
            } catch (error: any) {
                const message = error.msg;
                dispatch(setAlert({ id: uuidv4(), message: message, type: 'error' }));
            }
        }
        getStudentData();
    }, [student._id]);

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
            onClose();
        } catch (error: any) {
            const message = error.msg;
            dispatch(setAlert({ id: uuidv4(), message: message, type: 'error' }));
        }
    };

    const determineType = (s: string) => {
        let res = '';
        switch (s) {
            case 'String':
                res = 'text';
                break;
            case 'Date':
                res = 'date';
                break;
            case 'Number':
                res = 'number';
                break;
            case 'ObjectId':
                res = 'text';
                break;
            default:
                res = 'text';
        }
        return res;
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className='grid md:grid-cols-2 md:gap-x-5'>
                {fields.map((field) => (
                    <div key={field.name} className="mb-4 grid md:grid-cols-12 items-center">
                        <label className="block col-span-3 text-gray-700 text-sm text-left font-bold mb-2" htmlFor={field.name}>
                            {field.name}
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
                        className="bg-sky-700 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Save
                    </button>
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    );
};

export default StudentCard;
