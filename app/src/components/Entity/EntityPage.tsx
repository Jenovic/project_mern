import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setShowEditModal, setShowAddModal } from "../../slices/globalSlice";
import { setAlert } from "../../slices/alertSlice";
import { v4 as uuidv4 } from 'uuid';
import type { RootState } from "../../store";
import { getClassroomsSvc } from "../../services/classrooms";
import { loadClassrooms } from "../../slices/classroomSlice";
import BackButton from "../Nav/BackButton";
import NotificationModal from "../Modal/NotificationModal";

interface EntityPageProps {
    entityName: string;
    entities: any;
    selectedEntity: any;
    setSelectedEntity: (entity: any) => any;
    setLoading: (loading: boolean) => any;
    deleteSvc: (id: number) => Promise<any>;
    EntityListComponent: React.FC<{ showFull: boolean; }>;
}

const EntityPage: React.FC<EntityPageProps> = ({
    entityName,
    entities,
    selectedEntity,
    setSelectedEntity,
    setLoading,
    deleteSvc,
    EntityListComponent
}) => {
    const dispatch = useDispatch();
    const [showNotifModal, setShowNotifModal] = useState(false);
    const { classrooms } = useSelector((state: RootState) => state.classrooms);
    const { locations } = useSelector((state: RootState) => state.locations);

    useEffect(() => {
        dispatch(setLoading(false));
        dispatch(setSelectedEntity(entities[0]));

        if (classrooms.length === 0) {
            const loadClasses = async () => {
                const res = await getClassroomsSvc();
                dispatch(loadClassrooms(res.data.classrooms));
            }
            loadClasses();
        }
    }, []);

    const handleEdit = () => {
        dispatch(setShowEditModal(true));
    };

    const handleDelete = () => {
        setShowNotifModal(true);
    }

    const handleAdd = () => {
        dispatch(setShowAddModal(true));
    }

    const handleCloseNotifModal = () => {
        setShowNotifModal(false);
    };

    const handleSubmit = async () => {
        try {
            await deleteSvc(selectedEntity._id);
            dispatch(setAlert({ id: uuidv4(), message: `${entityName} deleted successfully`, type: 'success' }));
            setShowNotifModal(false);
        } catch (error: any) {
            const message = error.msg;
            dispatch(setAlert({ id: uuidv4(), message: message, type: 'error' }));
        } finally {
            dispatch(setLoading(true));
        }
    }

    return (
        <>
            <div className='mx-auto max-w-8xl overflow-hidden px-5 my-16'>
                <BackButton setLoading={setLoading} />
                <div className='flex pl-4 justify-between my-5 flex-col lg:flex-row gap-3'>
                    <div className="flex gap-4 items-center">
                        <span>All Locations | options:</span>
                        <div className='flex gap-4 prose-sys prose-p:cursor-pointer prose-p:m-0 prose-p:py-1 prose-p:px-2'>
                            <p className='hover:bg-sky-200 hover:shadow' title="Edit the selected row" onClick={handleEdit}>Edit <i className="fa-regular fa-pen-to-square"></i></p>
                            <p className='hover:bg-sky-200 hover:shadow' title="Delete the selected row" onClick={handleDelete}>Delete <i className="fa-solid fa-trash"></i></p>
                            <p className='hover:bg-sky-200 hover:shadow' title="Add a new record" onClick={handleAdd}>Add <i className="fa-solid fa-plus"></i></p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span>Filters:</span>
                        <select
                            id="locations"
                            name="locations"
                            onChange={() => { }}
                            className="col-span-9 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">Select location ...</option>
                            {locations?.map(option => (
                                <option key={option.name} value={option._id}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                        <select
                            id="classrooms"
                            name="classrooms"
                            onChange={() => { }}
                            className="col-span-9 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">Select classroom ...</option>
                            {classrooms?.map(option => (
                                <option key={option.name} value={option._id}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <EntityListComponent showFull={true} />
            </div>
            {showNotifModal && (
                <NotificationModal
                    show={showNotifModal}
                    onClose={handleCloseNotifModal}
                    onSubmit={handleSubmit}
                    title={`Delete ${entityName}`}
                    content={`Are you sure you want to delete ${entityName.toLocaleLowerCase()}: ${selectedEntity.name} ${selectedEntity.middleName ?? ''} ${selectedEntity.surname ?? ''} ? You cannot undo this operation`}
                    submitText='Delete'
                    cancelText="Cancel"
                    hideCloseBtn={false}
                />
            )}
        </>
    )
}

export default EntityPage;