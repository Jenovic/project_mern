import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAlert } from '../../slices/alertSlice';
import { setShowAddModal, setAddDisabled } from '../../slices/globalSlice';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../../store';
import { Field, FormData } from '../../utils/interfaces';
import NotificationModal from '../Modal/NotificationModal';
import FormField from '../Form/FormField';

interface EntityCardAddProps {
    entityName: string;
    addSvc: (formData: FormData) => Promise<any>;
    addEntity: (entity: any) => any;
    setLoading: (loading: boolean) => any;
    fields: Field[];
}

const EntityCardAdd: React.FC<EntityCardAddProps> = ({
    entityName,
    addSvc,
    addEntity,
    setLoading,
    fields
}) => {
    const dispatch = useDispatch();
    const { showAddModal, addDisabled } = useSelector((state: RootState) => state.global);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [formData, setFormData] = useState<FormData>({});
    const [filteredFields, setFilteredFields] = useState<Field[]>([]);
    const [showNotifModal, setShowNotifModal] = useState(false);

    useEffect(() => {
        const filtered = fields.filter(
            (field: Field) => !['__v', 'responsables', 'dateCreated', 'dateModified', '_id'].includes(field.name)
        );
        setFilteredFields(filtered);
    }, [addDisabled, showAddModal]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        dispatch(setAddDisabled(false));
    };

    const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();

        const emptyRequiredFields = fields.some(field => field.required && !formData[field.name as keyof FormData]);
        if (emptyRequiredFields) {
            dispatch(setAlert({ id: uuidv4(), message: 'Please fill in all required fields', type: 'error' }));
            return;
        }

        try {
            const response = await addSvc(formData);
            dispatch(setAlert({ id: uuidv4(), message: `${entityName} added successfully`, type: 'success' }));
            dispatch(addEntity(response.data));
            dispatch(setShowAddModal(false));
        } catch (error: any) {
            const message = error.msg;
            dispatch(setAlert({ id: uuidv4(), message: message, type: 'error' }));
        } finally {
            dispatch(setLoading(true));
            dispatch(setAddDisabled(true));
        }
    };

    const handleCloseModal = () => {
        if (addDisabled) {
            dispatch(setShowAddModal(false));
            dispatch(setLoading(true));
            dispatch(setAddDisabled(true));
        } else {
            setShowNotifModal(true);
        }
    };

    const handleCloseNotifModal = () => {
        setShowNotifModal(false);
        dispatch(setShowAddModal(false));
        dispatch(setAddDisabled(true));
        dispatch(setLoading(true));
    };

    return (
        <>
            {showAddModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white">
                        <div className="text-center">
                            <div className="flex items-center justify-between px-5">
                                <span className='font-bold uppercase'>{`Add ${entityName}`}</span>
                                <button
                                    className="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700"
                                    onClick={() => handleCloseModal()}
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                            <div className="px-5 py-5">
                                <form onSubmit={handleSubmit}>
                                    <div className='grid lg:grid-cols-2 lg:gap-x-5'>
                                        {filteredFields.map((field) => (
                                            <FormField key={field.name} field={field} value={formData[field.name as keyof FormData] as string} onChange={handleChange} />
                                        ))}
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-end gap-5">
                                            <button
                                                className={`text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${addDisabled ? 'bg-gray-600' : 'bg-sky-600 hover:bg-sky-400'}`}
                                                type="submit"
                                                disabled={addDisabled}
                                            >
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                onClick={() => handleCloseModal()}
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
            {showNotifModal && (
                <NotificationModal
                    show={showNotifModal}
                    onClose={handleCloseNotifModal}
                    onSubmit={handleSubmit}
                    title={`Add ${entityName}`}
                    content='Save your changes and add the record? Otherwise your changes will not apply.'
                    submitText='Save and Add'
                    cancelText="Don't save"
                    hideCloseBtn={false}
                />
            )}
        </>
    );
}

export default EntityCardAdd;
