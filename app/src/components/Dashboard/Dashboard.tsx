import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
import { setShowFormModal } from '../../slices/globalSlice';
import { deleteStudentSvc } from '../../services/students';
import { setAlert } from '../../slices/alertSlice';
import { setLoading } from '../../slices/studentSlice';
import { v4 as uuidv4 } from 'uuid';
import LeftMenu from '../Nav/LeftMenu';
import Tiles from './Tiles';
import StudentList from '../Student/StudentList';
import TeacherList from '../Teacher/TeacherList';
import ClassroomList from '../Classroom/ClassroomList';
import Loader from '../Loader';
import NotificationModal from '../Modal/NotificationModal';

const Dashboard = () => {
    const { loading } = useSelector((state: RootState) => state.auth);
    const { selectedStudent } = useSelector((state: RootState) => state.students);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showNotifModal, setShowNotifModal] = useState(false);

    const handleEdit = () => {
        dispatch(setShowFormModal(true));
    }

    const handleDelete = () => {
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
            {loading ? (
                <Loader />
            ) : (
                <div className='mx-auto max-w-8xl overflow-hidden px-5'>
                    <div className='grid lg:grid-cols-12 gap-6 my-20'>
                        <div className='hidden lg:block lg:col-span-3'><LeftMenu /></div>
                        <div className='lg:col-span-9 gap-5'>
                            <div className='grid grid-cols-4 gap-4 lg:p-1'>
                                <Tiles name="Students" iconClass='fa-solid fa-users' iconColor='orange-500' onclick={() => { navigate('/students'); }}></Tiles>
                                <Tiles name="Teachers" iconClass='fa-solid fa-user' iconColor='blue-500' onclick={() => { navigate('/teachers'); }}></Tiles>
                                <Tiles name="Classrooms" iconClass='fa-solid fa-school' iconColor='green-500' onclick={() => { navigate('/classrooms'); }}></Tiles>
                                <Tiles name="Statistics" iconClass='fa-solid fa-chart-simple' iconColor='pink-500' onclick={() => { }}></Tiles>
                            </div>
                            <div className='gap-5'>
                                <div className='flex pl-4 gap-4 items-center my-5'>
                                    <span>All Locations | options:</span>
                                    <div className='flex gap-4 prose-sys prose-p:cursor-pointer prose-p:m-0 prose-p:py-1 prose-p:px-2'>
                                        <p className='hover:bg-sky-200 hover:shadow' title="Edit the selected row" onClick={handleEdit}>Edit <i className="fa-regular fa-pen-to-square"></i></p>
                                        <p className='hover:bg-sky-200 hover:shadow' title="Delete the selected row" onClick={handleDelete}>Delete <i className="fa-solid fa-trash"></i></p>
                                    </div>
                                </div>
                                <StudentList showFull={false} />
                                <TeacherList showFull={false} />
                                <ClassroomList />
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
                    title='Delete Student'
                    content={`Are you sure you want to delete student: ${selectedStudent.name} ${selectedStudent.surname} ? You cannot undo this operation`}
                    submitText='Delete'
                    cancelText="Cancel"
                />
            )}
        </>
    )
}

export default Dashboard;