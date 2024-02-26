import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

const LeftMenu = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    return (
        <div>
            <div className='px-5 py-4 bg-sky-900 rounded-t-xl flex flex-col gap-1'>
                <span className='text-xl text-white'>Logged in: {user?.name}</span>
                <span className='text-white text-base'><i className="fa fa-envelope"></i> email: {user?.email}</span>
            </div>
            <div className='px-5 py-8 flex flex-col gap-4 bg-gray-300 prose prose-p:m-0 prose-p:px-3 prose-p:py-2 prose-p:bg-gray-400 hover:prose-p:bg-sky-100 prose-p:rounded-md prose-p:no-underline prose-p:cursor-pointer'>
                <p>Students</p>
                <p>Teachers</p>
                <p>Classrooms</p>
                <div className='flex flex-col'>
                    <span className='font-bold'><i className="fa-solid fa-gear"></i> System Settings</span>
                    <div className='mt-3'>
                        <label className='font-medium'>Locations: </label>
                        <select className='rounded w-full h-9 px-2'>
                            <option>Choose location</option>
                            <option>Bel-air</option>
                            <option>Kasapa</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeftMenu;