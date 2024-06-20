import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setShowFormModal } from "../../slices/globalSlice";
import { deleteStudentSvc } from "../../services/students";
import { setAlert } from "../../slices/alertSlice";
import { setLoading } from "../../slices/studentSlice";
import { RootState } from "../../store";
import { v4 as uuidv4 } from 'uuid';
import StudentList from "./StudentList";
import BackButton from "../Nav/BackButton";
import NotificationModal from "../Modal/NotificationModal";

const Students = () => {
    const dispatch = useDispatch();
    const [showNotifModal, setShowNotifModal] = useState(false);

    const { selectedStudent } = useSelector((state: RootState) => state.students);

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
            await deleteStudentSvc(selectedStudent._id);
            dispatch(setAlert({ id: uuidv4(), message: 'Student deleted successfully', type: 'success' }));
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
                <BackButton />
                <div className='flex pl-4 gap-4 items-center my-5'>
                    <span>All Locations | options:</span>
                    <div className='flex gap-4 prose-sys prose-p:cursor-pointer prose-p:m-0 prose-p:py-1 prose-p:px-2'>
                        <p className='hover:bg-sky-200 hover:shadow' title="Edit the selected row" onClick={handleEdit}>Edit <i className="fa-regular fa-pen-to-square"></i></p>
                        <p className='hover:bg-sky-200 hover:shadow' title="Delete the selected row" onClick={handleDelete}>Delete <i className="fa-solid fa-trash"></i></p>
                    </div>
                </div>
                <StudentList showFull={true} />
            </div>
            {showNotifModal && (
                <NotificationModal
                    show={showNotifModal}
                    onClose={handleCloseNotifModal}
                    onSubmit={handleSubmit}
                    title='Delete Student'
                    content={`Are you sure you want to delete student: ${selectedStudent.name} ${selectedStudent.surname} ? You cannot undo this operation`}
                    submitText='Delete'
                    cancelText="Cancel"
                />
            )}
        </>
    )
}

export default Students;