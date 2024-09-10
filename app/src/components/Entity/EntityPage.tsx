import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setShowEditModal, setShowAddModal, setLocationFilter, setClassroomFilter } from "../../slices/globalSlice";
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
    const [filterLocation, setFilterLocation] = useState('');
    const [filterClassroom, setFilterClassroom] = useState('');
    const { classrooms } = useSelector((state: RootState) => state.classrooms);
    const { locations } = useSelector((state: RootState) => state.locations);
    const { user } = useSelector((state: RootState) => state.auth);

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
    }, [entities]);

    const memoizedClassrooms = useMemo(
        () => { return classrooms; },
        [classrooms, entities]
    );

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

    const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterLocation(e.target.value);
        dispatch(setLocationFilter(e.target.value));
    }

    const handleClassroomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterClassroom(e.target.value);
        dispatch(setClassroomFilter(e.target.value));
    }

    const handleFilterEntity = () => {
        dispatch(setLoading(true));
    }

    const clearFilter = () => {
        setFilterLocation('');
        setFilterClassroom('');
        dispatch(setLocationFilter(''));
        dispatch(setClassroomFilter(''));
        dispatch(setLoading(true));
    }

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
                            <p className={`${user.role === 'staff' ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-sky-200 hover:shadow'}`} title={`${user?.role !== 'staff' ? 'Delete the selected row' : 'Only an Admin user can perform this task'}`} onClick={user.role !== 'staff' ? handleDelete : undefined} aria-disabled={user.role === 'staff'}>Delete <i className="fa-solid fa-trash"></i></p>
                            <p className='hover:bg-sky-200 hover:shadow' title="Add a new record" onClick={handleAdd}>Add <i className="fa-solid fa-plus"></i></p>
                        </div>
                    </div>
                    {entityName !== 'User' &&
                        <div className="flex items-center gap-3">
                            {(filterClassroom || filterLocation) && <span className="w-1/2 underline text-sm cursor-pointer" onClick={clearFilter}>clear filter</span>}
                            <select
                                id="locations"
                                name="locations"
                                value={filterLocation || ''}
                                onChange={handleLocationChange}
                                className="col-span-9 shadow border border-r-8 border-transparent rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="">Location ...</option>
                                {locations?.map(option => (
                                    <option key={option.name} value={option._id}>
                                        {option.name}
                                    </option>
                                ))}
                            </select>
                            {entityName !== 'Classroom' &&
                                <select
                                    id="classrooms"
                                    name="classrooms"
                                    value={filterClassroom || ''}
                                    onChange={handleClassroomChange}
                                    className="col-span-9 shadow border border-r-8 border-transparent rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="">Classroom ...</option>
                                    {memoizedClassrooms?.map(option => (
                                        <option key={option.name} value={option._id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            }
                            <button onClick={() => handleFilterEntity()} className="text-black inline-block text-md cursor-pointer bg-sky-300 px-4 py-2 rounded-md font-semibold hover:bg-sky-500">Filter</button>
                        </div>
                    }
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