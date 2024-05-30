import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLoading } from '../../slices/authSlice';
import type { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
import LeftMenu from './LeftMenu';
import Tiles from './Tiles';
import StudentList from '../Student/StudentList';
import TeacherList from '../Teacher/TeacherList';
import ClassroomList from '../Classroom/ClassroomList';
import Loader from '../Loader';

const Dashboard = () => {
    const { loading } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setLoading(false));
    }, []);

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <div className='container mx-auto'>
                    <div className='grid md:grid-cols-12 gap-8 my-20'>
                        <div className='md:col-span-3'><LeftMenu /></div>
                        <div className='md:col-span-9 grid gap-5'>
                            <div className='grid grid-cols-4 gap-6'>
                                <Tiles name="Students" iconClass='fa-solid fa-users' iconColor='orange-500' onclick={() => { navigate('/students'); }}></Tiles>
                                <Tiles name="Teachers" iconClass='fa-solid fa-user' iconColor='blue-500' onclick={() => { navigate('/teachers'); }}></Tiles>
                                <Tiles name="Classrooms" iconClass='fa-solid fa-school' iconColor='green-500' onclick={() => { navigate('/classrooms'); }}></Tiles>
                                <Tiles name="Statistics" iconClass='fa-solid fa-chart-simple' iconColor='pink-500' onclick={() => { }}></Tiles>
                            </div>
                            <div className='grid gap-5'>
                                <div className='flex pl-4 gap-4 items-center'>
                                    <span>All Locations | options:</span>
                                    <div className='flex gap-4 prose-sys prose-p:cursor-pointer prose-p:m-0 prose-p:py-1 prose-p:px-2'>
                                        <p className='hover:bg-sky-200 hover:shadow' title="Edit the selected row">Edit <i className="fa-regular fa-pen-to-square"></i></p>
                                        <p className='hover:bg-sky-200 hover:shadow' title="Delete the selected row">Delete <i className="fa-solid fa-trash"></i></p>
                                    </div>
                                </div>
                                <StudentList />
                                <TeacherList />
                                <ClassroomList />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Dashboard;