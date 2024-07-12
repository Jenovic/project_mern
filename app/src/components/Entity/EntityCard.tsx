import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAlert } from '../../slices/alertSlice';
import { setShowEditModal, setUpdateDisabled } from '../../slices/globalSlice';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../../store';
import { Field, Responsable, FormData } from '../../utils/interfaces';
import { formatDate } from '../../utils/helpers';
import NotificationModal from '../Modal/NotificationModal';
import FormField from '../Form/FormField';
import ResponsableTabs from '../Student/ResponsableTabs';

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

    const [formData, setFormData] = useState<FormData>({});
    const [filteredFields, setFilteredFields] = useState<Field[]>([]);
    const [showNotifModal, setShowNotifModal] = useState(false);
    const [showResponsableNotifModal, setShowResponsableNotifModal] = useState(false);
    const [responsableName, setResponsableName] = useState('');
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
    }, [selectedEntity, updateDisabled, showEditModal]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        dispatch(setUpdateDisabled(false));
    };

    const handleResponsableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setSelectedEntity((prevEntity: any) => {
            const updatedResponsables = [...(prevEntity.responsables || [])];
            updatedResponsables[activeTab] = {
                ...updatedResponsables[activeTab],
                [name]: value,
            };

            return {
                ...prevEntity,
                responsables: updatedResponsables,
            };
        });

        setFormData(prevFormData => {
            const updatedResponsables = [...(prevFormData.responsables || [])];
            updatedResponsables[activeTab] = {
                ...updatedResponsables[activeTab],
                [name]: value,
            };

            return {
                ...prevFormData,
                responsables: updatedResponsables,
            };
        });

        dispatch(setUpdateDisabled(false));
    };


    const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();

        const emptyRequiredFields = fields.some(field => field.required && !formData[field.name as keyof FormData]);
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

    const handleCloseResponsableModal = () => {
        setShowResponsableNotifModal(false);
    }

    const handleDeleteResponsable = () => {
        setSelectedEntity((prevEntity: any) => {
            const updatedResponsables = prevEntity.responsables.filter((_: Responsable, idx: number) => idx !== activeTab);

            return {
                ...prevEntity,
                responsables: updatedResponsables,
            };
        });

        setFormData((prevFormData: FormData) => {
            const updatedResponsables = (prevFormData.responsables || []).filter((_: Responsable, idx: number) => idx !== activeTab);

            return {
                ...prevFormData,
                responsables: updatedResponsables,
            };
        });

        setActiveTab((prevActiveTab) => Math.max(0, prevActiveTab - 1));

        dispatch(setUpdateDisabled(false));
        setShowResponsableNotifModal(false);
    };


    const handleDeleteResponsableClick = (name: any) => {
        setResponsableName(name);
        setShowResponsableNotifModal(true);
    }

    const handleAddResponsable = () => {

    }

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
                                            <FormField key={field.name} field={field} value={formData[field.name as keyof FormData] as string} onChange={handleChange} />
                                        ))}
                                    </div>
                                    {formData.responsables && formData.responsables.length > 0 && (
                                        <div className="mt-5">
                                            <div className='flex justify-between mb-2'>
                                                <h3 className="font-bold text-lg text-left">Responsables Details</h3>
                                                {formData.responsables.length < 2 && <p className='hover:bg-sky-200 hover:shadow p-2 cursor-pointer' title="Add a new responsable" onClick={() => handleAddResponsable()}>Add Responsable <i className="fa-solid fa-plus"></i></p>}
                                            </div>
                                            <ResponsableTabs
                                                responsables={formData.responsables}
                                                activeTab={activeTab}
                                                setActiveTab={setActiveTab}
                                                handleResponsableChange={handleResponsableChange}
                                                handleDeleteResponsableClick={handleDeleteResponsableClick}
                                            />
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
            {showResponsableNotifModal && (
                <NotificationModal
                    show={showResponsableNotifModal}
                    onClose={handleCloseResponsableModal}
                    onSubmit={handleDeleteResponsable}
                    title={`Delete ${responsableName}`}
                    content='Are you sure you want to delete this responsable from the student?'
                    submitText='Delete'
                    cancelText="Cancel"
                />
            )}
        </>
    );
}

export default EntityCard;
