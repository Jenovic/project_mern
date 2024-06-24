import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setShowFormModal } from "../../slices/globalSlice";
import { setAlert } from "../../slices/alertSlice";
import { v4 as uuidv4 } from 'uuid';
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

    useEffect(() => {
        dispatch(setLoading(false));
        dispatch(setSelectedEntity(entities[0]));
    }, []);

    const handleEdit = () => {
        dispatch(setShowFormModal(true));
    };

    const handleDelete = async () => {
        setShowNotifModal(true);
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
                <div className='flex pl-4 gap-4 items-center my-5'>
                    <span>All Locations | options:</span>
                    <div className='flex gap-4 prose-sys prose-p:cursor-pointer prose-p:m-0 prose-p:py-1 prose-p:px-2'>
                        <p className='hover:bg-sky-200 hover:shadow' title="Edit the selected row" onClick={handleEdit}>Edit <i className="fa-regular fa-pen-to-square"></i></p>
                        <p className='hover:bg-sky-200 hover:shadow' title="Delete the selected row" onClick={handleDelete}>Delete <i className="fa-solid fa-trash"></i></p>
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
                    content={`Are you sure you want to delete ${entityName.toLocaleLowerCase()}: ${selectedEntity.name} ${selectedEntity.middleName} ${selectedEntity.surname} ? You cannot undo this operation`}
                    submitText='Delete'
                    cancelText="Cancel"
                />
            )}
        </>
    )
}

export default EntityPage;