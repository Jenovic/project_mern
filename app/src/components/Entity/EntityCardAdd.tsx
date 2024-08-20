import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAlert } from '../../slices/alertSlice';
import { setShowAddModal, setAddDisabled, setAddResponsableDisabled } from '../../slices/globalSlice';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../../store';
import { Field, FormData, Responsable } from '../../utils/interfaces';
import { genderOptions, relationshipOptions } from '../../utils/helpers';
import NotificationModal from '../Modal/NotificationModal';
import FormField from '../Form/FormField';
import ResponsableTabs from '../Student/ResponsableTabs';
import ResponsableModal from '../Modal/ResponsableModal';

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
    const { showAddModal, addDisabled, addResponsableDisabled } = useSelector((state: RootState) => state.global);
    const locationOptions = useSelector((state: RootState) => state.locations?.locations);
    const classOptions = useSelector((state: RootState) => state.classrooms?.classrooms);

    const memoizedLocationOptions = useMemo(
        () => locationOptions?.map((loc: any) => ({ value: loc._id, label: loc.name })),
        [locationOptions]
    );

    const memoizedClassOptions = useMemo(
        () => classOptions.map((cls: any) => ({ value: cls._id, label: cls.name })),
        [classOptions]
    );

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
    const [showResponsableModal, setShowResponsableModal] = useState(false);
    const [responsablesSubfields, setResponsablesSubfields] = useState<Field[]>([]);
    const [showAddResponsableNotifModal, setShowAddResponsableNotifModal] = useState(false);

    useEffect(() => {
        const filtered = fields.filter(
            (field: Field) => !['__v', 'responsables', 'dateCreated', 'dateModified', '_id'].includes(field.name)
        );
        setFilteredFields(filtered);
        const responsablesField = fields.find(field => field.name === "responsables");
        setResponsablesSubfields(responsablesField?.subfields || []);
    }, [addDisabled, showAddModal]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'location') {
            const selectedLocation = memoizedLocationOptions?.find(option => option.value === value);
            setFormData({
                ...formData,
                location: {
                    _id: selectedLocation?.value,
                    name: selectedLocation?.label,
                },
            });
        } else if (name === 'class') {
            const selectedClass = memoizedClassOptions?.find(option => option.value === value);
            setFormData({
                ...formData,
                class: {
                    _id: selectedClass?.value,
                    name: selectedClass?.label,
                },
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
        dispatch(setAddDisabled(false));
    };

    const handleResponsableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

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

        dispatch(setAddDisabled(false));
    };

    const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();

        const emptyRequiredFields = fields.some(field => field.required && !formData[field.name as keyof FormData]);
        if (emptyRequiredFields) {
            dispatch(setAlert({ id: uuidv4(), message: 'Please fill in all required fields', type: 'error' }));
            setShowNotifModal(false);
            return;
        }

        if (responsablesSubfields.length > 0) {
            if (!formData.responsables || formData.responsables.length < 1) {
                if (showNotifModal) setShowNotifModal(false);
                dispatch(setAlert({ id: uuidv4(), message: 'At least one Responsable is required to add a new student', type: 'error' }));
                return;
            }
        }

        try {
            const response = await addSvc(formData);
            dispatch(setAlert({ id: uuidv4(), message: `${entityName} added successfully`, type: 'success' }));
            dispatch(addEntity(response.data));
            dispatch(setShowAddModal(false));
        } catch (error: any) {
            dispatch(setAlert({ id: uuidv4(), message: error.message, type: 'error' }));
        } finally {
            dispatch(setLoading(true));
            dispatch(setAddDisabled(true));
        }
    };

    const handleAddResponsableSubmit = (newResponsable: Responsable) => {
        setFormData((prevFormData: FormData) => {
            const updatedResponsables = [...(prevFormData.responsables || []), newResponsable];

            return {
                ...prevFormData,
                responsables: updatedResponsables,
            };
        });
        setShowResponsableModal(false);
        dispatch(setAddResponsableDisabled(true));
        dispatch(setAddDisabled(false));
    }

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

    const handlecloseAddResponsableModal = () => {
        if (!addResponsableDisabled) {
            setShowAddResponsableNotifModal(true);
        } else {
            setShowResponsableModal(false);
            dispatch(setAddResponsableDisabled(true));
        }
    }

    const handleAddResponsable = () => {
        setShowResponsableModal(true);
    }

    return (
        <>
            {showAddModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-24 mx-auto p-5 border w-3/4 shadow-lg rounded-md bg-white">
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
                                            <FormField
                                                key={field.name}
                                                field={field}
                                                value={formData[field.name as keyof FormData] as string}
                                                onChange={handleChange}
                                                options={
                                                    field.name === 'location' ?
                                                        memoizedLocationOptions : field.name === 'class' ?
                                                            memoizedClassOptions : field.name === 'gender' ?
                                                                genderOptions : field.name === 'relationshipToStudent' ?
                                                                    relationshipOptions : undefined}
                                            />
                                        ))}
                                    </div>
                                    {responsablesSubfields.length > 0 &&
                                        <div className="mt-5">
                                            <div className='flex justify-between mb-2'>
                                                <h3 className="font-bold text-lg text-left">Responsables Details</h3>
                                                <p className='hover:bg-sky-200 hover:shadow p-2 cursor-pointer' title="Add a new responsable" onClick={() => handleAddResponsable()}>Add Responsable <i className="fa-solid fa-plus"></i></p>
                                            </div>
                                            {formData.responsables && formData.responsables.length > 0 && (
                                                <ResponsableTabs
                                                    responsables={formData.responsables}
                                                    activeTab={activeTab}
                                                    setActiveTab={setActiveTab}
                                                    handleResponsableChange={handleResponsableChange}
                                                    handleDeleteResponsableClick={() => { }}
                                                    fields={responsablesSubfields as Field[]}
                                                />
                                            )}
                                        </div>
                                    }
                                    <div className="flex items-center justify-end gap-5 mt-5">
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
            {showAddResponsableNotifModal && (
                <NotificationModal
                    show={showAddResponsableNotifModal}
                    onClose={() => {
                        setShowAddResponsableNotifModal(false);
                        setShowResponsableModal(false);
                        dispatch(setAddResponsableDisabled(true));
                    }}
                    onSubmit={() => {
                        setShowAddResponsableNotifModal(false);
                    }}
                    title={`Add Responsable`}
                    content='Are you sure you want to cancel your changes?'
                    submitText='No'
                    cancelText="Yes"
                    hideCloseBtn={true}
                />
            )}
            {showResponsableModal && (
                <ResponsableModal
                    show={showResponsableModal}
                    fields={responsablesSubfields as Field[]}
                    onClose={handlecloseAddResponsableModal}
                    onAddResponsable={handleAddResponsableSubmit}
                />
            )}
        </>
    );
}

export default EntityCardAdd;
