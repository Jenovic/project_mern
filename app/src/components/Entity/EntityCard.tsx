import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAlert } from '../../slices/alertSlice';
import { setShowFormModal, setUpdateDisabled } from '../../slices/globalSlice';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../../store';
import NotificationModal from '../Modal/NotificationModal';
import FormField from '../Form/FormField';

interface Field {
    name: string;
    type: string;
    required: boolean;
}

interface FormData {
    [key: string]: string | undefined;
    name?: string;
    middleName?: string;
    surname?: string;
    dob?: string;
    address?: string;
    phoneNumber?: string
}

interface EntityCardProps {
    entityName: string;
    fetchSvc: (id: number) => Promise<any>;
    updateSvc: (id: number, formData: FormData) => Promise<any>;
    updateEntity: (entity: any) => any;
    setLoading: (loading: boolean) => any;
    setSelectedEntity: (entity: any) => any;
    selectedEntity: any;
}

const EntityCard: React.FC<EntityCardProps> = ({
    entityName,
    fetchSvc,
    updateSvc,
    updateEntity,
    setLoading,
    setSelectedEntity,
    selectedEntity,
}) => {
    const dispatch = useDispatch();
    const { showFormModal, updateDisabled } = useSelector((state: RootState) => state.global);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [formData, setFormData] = useState<FormData>({});
    const [fields, setFields] = useState<Field[]>([]);
    const [showNotifModal, setShowNotifModal] = useState(false);

    useEffect(() => {
        if (selectedEntity) {
            const initialFormData = {
                ...selectedEntity,
                dob: selectedEntity.dob ? formatDate(selectedEntity.dob) : '',
            };
            setFormData(initialFormData);
        }
    }, [selectedEntity]);

    useEffect(() => {
        const getEntityData = async () => {
            if (selectedEntity) {
                try {
                    const response = await fetchSvc(selectedEntity._id);
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
        getEntityData();
    }, [selectedEntity, updateDisabled, showFormModal]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        dispatch(setUpdateDisabled(false));
    };

    const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();
        try {
            const response = await updateSvc(selectedEntity._id, formData);
            dispatch(setAlert({ id: uuidv4(), message: `${entityName} updated successfully`, type: 'success' }));
            dispatch(updateEntity(response.data));
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
        if (updateDisabled) {
            dispatch(setShowFormModal(false));
            dispatch(setSelectedEntity(null));
            dispatch(setLoading(true));
            dispatch(setUpdateDisabled(true));
        } else {
            setShowNotifModal(true);
        }
    };

    const handleCloseNotifModal = () => {
        setShowNotifModal(false);
        dispatch(setShowFormModal(false));
        dispatch(setSelectedEntity(null));
        dispatch(setUpdateDisabled(true));
        dispatch(setLoading(true));
    };

    if (!selectedEntity) {
        return null;
    }

    return (
        <>
            {showFormModal && selectedEntity && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white">
                        <div className="text-center">
                            <div className="flex items-center justify-between px-5">
                                <span className='font-bold uppercase'>({entityName.toUpperCase()}) {selectedEntity.name} {selectedEntity.middleName} {selectedEntity.surname} </span>
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
                                        {fields.map((field) => (
                                            <FormField key={field.name} field={field} value={formData[field.name]} onChange={handleChange} />
                                        ))}
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-end gap-5">
                                            <button
                                                className={`text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${updateDisabled ? 'bg-gray-600' : 'bg-sky-600 hover:bg-sky-400'}`}
                                                type="submit"
                                                disabled={updateDisabled}
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
                    title={`Edit ${entityName}`}
                    content='Save your changes and update the record? Otherwise your changes will not apply.'
                    submitText='Save and Update'
                    cancelText="Don't save"
                />
            )}
        </>
    );
}

export default EntityCard;
