import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Field, FormData, Responsable } from '../../utils/interfaces';
import { genderOptions, relationshipOptions } from '../../utils/helpers';
import { setAddResponsableDisabled } from '../../slices/globalSlice';
import { RootState } from '../../store';
import { setAlert } from '../../slices/alertSlice';
import { v4 as uuidv4 } from 'uuid';
import FormField from '../Form/FormField';

interface ResponsableModalProps {
    show: boolean;
    fields: Field[];
    onClose: () => void;
    onAddResponsable: (newResponsable: Responsable) => void;
}

const ResponsableModal: React.FC<ResponsableModalProps> = ({ show, fields, onClose, onAddResponsable }) => {
    const { addResponsableDisabled } = useSelector((state: RootState) => state.global);
    const [formData, setFormData] = useState<FormData>({});
    const [filteredFields, setFilteredFields] = useState<Field[]>([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const filtered = fields.filter((field: Field) => !['_id'].includes(field.name));
        setFilteredFields(filtered);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        dispatch(setAddResponsableDisabled(false));
    };

    const handleModalSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();

        const emptyRequiredFields = fields.some(field => field.required && !formData[field.name as keyof FormData]);
        if (emptyRequiredFields) {
            dispatch(setAlert({ id: uuidv4(), message: 'Please fill in all required fields', type: 'error' }));
            return;
        }

        const newResponsable = { ...formData };

        // Call a function passed via props to update the parent state
        // This function should be defined in EntityCard and passed down to ResponsableModal
        if (typeof onAddResponsable === 'function') {
            onAddResponsable(newResponsable);
        }
        // Close the modal and reset the form
        setFormData({});
        dispatch(setAddResponsableDisabled(true));
    }

    if (!show) return null;

    return (
        <>
            {show && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-1/2 shadow-lg rounded-md bg-white">
                        <div className="text-center">
                            <div className="flex items-center justify-between">
                                <span className='font-bold uppercase'>Add Responsable</span>
                                <button
                                    className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700"
                                    onClick={onClose}
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                            <form onSubmit={handleModalSubmit}>
                                <div className="py-5">

                                    {filteredFields.map((field) => (
                                        <FormField
                                            key={field.name}
                                            field={field}
                                            value={formData[field.name as keyof FormData] as string}
                                            onChange={handleChange}
                                            options={field.name === 'relationshipToStudent' ? relationshipOptions : undefined}
                                        />
                                    ))}
                                </div>
                                <div>
                                    <div className="flex items-center justify-end gap-5">
                                        <button
                                            className={`text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${addResponsableDisabled ? 'bg-gray-600' : 'bg-sky-600 hover:bg-sky-400'}`}
                                            type="submit"
                                            disabled={addResponsableDisabled}
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ResponsableModal;