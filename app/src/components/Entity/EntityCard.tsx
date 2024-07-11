import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAlert } from '../../slices/alertSlice';
import { setShowEditModal, setUpdateDisabled } from '../../slices/globalSlice';
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

interface Responsable {
    name: string;
    middleName?: string;
    surname: string;
    phoneNumber?: string;
    address?: string;
    email?: string;
    relationshipToStudent: string;
    _id?: string;
}

interface EntityCardProps {
    entityName: string;
    updateSvc: (id: number, formData: FormData) => Promise<any>;
    updateEntity: (entity: any) => any;
    setLoading: (loading: boolean) => any;
    setSelectedEntity: (entity: any) => any;
    selectedEntity: any;
    fields: Field[];
}

const EntityCard: React.FC<EntityCardProps> = ({
    entityName,
    updateSvc,
    updateEntity,
    setLoading,
    setSelectedEntity,
    selectedEntity,
    fields
}) => {
    const dispatch = useDispatch();
    const { showEditModal, updateDisabled } = useSelector((state: RootState) => state.global);

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
    const [activeTab, setActiveTab] = useState(0);

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
        if (selectedEntity) {
            const filtered = fields.filter((field: Field) => !['__v', 'responsables'].includes(field.name));
            setFilteredFields(filtered);
        }
        console.log('reached');
    }, [selectedEntity, updateDisabled, showEditModal]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        dispatch(setUpdateDisabled(false));
    };
    console.log(selectedEntity);

    const handleResponsableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedResponsables = [...selectedEntity.responsables];
        updatedResponsables[activeTab] = {
            ...updatedResponsables[activeTab],
            [name]: value,
        };
        setSelectedEntity({
            ...selectedEntity,
            responsables: updatedResponsables,
        });
        dispatch(setUpdateDisabled(false));
    };

    const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();

        const emptyRequiredFields = fields.some(field => field.required && !formData[field.name]);
        if (emptyRequiredFields) {
            dispatch(setAlert({ id: uuidv4(), message: 'Please fill in all required fields', type: 'error' }));
            return;
        }

        try {
            const response = await updateSvc(selectedEntity._id, formData);
            dispatch(setAlert({ id: uuidv4(), message: `${entityName} updated successfully`, type: 'success' }));
            dispatch(updateEntity(response.data));
            dispatch(setShowEditModal(false));
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
            dispatch(setShowEditModal(false));
            dispatch(setSelectedEntity(null));
            dispatch(setLoading(true));
            dispatch(setUpdateDisabled(true));
        } else {
            setShowNotifModal(true);
        }
    };

    const handleCloseNotifModal = () => {
        setShowNotifModal(false);
        dispatch(setShowEditModal(false));
        dispatch(setSelectedEntity(null));
        dispatch(setUpdateDisabled(true));
        dispatch(setLoading(true));
    };

    if (!selectedEntity) {
        return null;
    }

    return (
        <>
            {showEditModal && selectedEntity && (
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
                                        {filteredFields.map((field) => (
                                            <FormField key={field.name} field={field} value={formData[field.name]} onChange={handleChange} />
                                        ))}
                                    </div>
                                    {selectedEntity.responsables && selectedEntity.responsables.length > 0 && (
                                        <div className="mt-5">
                                            <h3 className="font-bold text-lg text-left mb-4">Responsables Details</h3>
                                            <ul className="flex border-b">
                                                {selectedEntity.responsables.map((responsable: Responsable, idx: number) => (
                                                    <li key={responsable._id} className={`mr-1 ${activeTab === idx ? 'border-l border-t border-r rounded-t' : ''}`}>
                                                        <a
                                                            className={`bg-white inline-block py-2 px-4 font-semibold cursor-pointer ${activeTab === idx ? 'text-blue-500 hover:text-blue-800' : ''}`}
                                                            onClick={() => setActiveTab(idx)}
                                                        >
                                                            {responsable.name} {responsable.surname}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="p-5 border-l border-r border-b">
                                                <div className='grid lg:grid-cols-2 lg:gap-x-5'>

                                                    {selectedEntity.responsables[activeTab] && (
                                                        <>
                                                            <FormField
                                                                field={{ name: 'name', type: 'text', required: true }}
                                                                value={selectedEntity.responsables[activeTab].name}
                                                                onChange={handleResponsableChange}
                                                            />
                                                            <FormField
                                                                field={{ name: 'middleName', type: 'text', required: false }}
                                                                value={selectedEntity.responsables[activeTab].middleName}
                                                                onChange={handleResponsableChange}
                                                            />
                                                            <FormField
                                                                field={{ name: 'surname', type: 'text', required: true }}
                                                                value={selectedEntity.responsables[activeTab].surname}
                                                                onChange={handleResponsableChange}
                                                            />
                                                            <FormField
                                                                field={{ name: 'relationshipToStudent', type: 'text', required: true }}
                                                                value={selectedEntity.responsables[activeTab].relationshipToStudent}
                                                                onChange={handleResponsableChange}
                                                            />
                                                            <FormField
                                                                field={{ name: 'phoneNumber', type: 'text', required: false }}
                                                                value={selectedEntity.responsables[activeTab].phoneNumber}
                                                                onChange={handleResponsableChange}
                                                            />
                                                            <FormField
                                                                field={{ name: 'address', type: 'text', required: false }}
                                                                value={selectedEntity.responsables[activeTab].address}
                                                                onChange={handleResponsableChange}
                                                            />
                                                            <FormField
                                                                field={{ name: 'email', type: 'text', required: false }}
                                                                value={selectedEntity.responsables[activeTab].email}
                                                                onChange={handleResponsableChange}
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-end gap-5 mt-5">
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
