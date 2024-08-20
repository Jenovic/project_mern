import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

const LeftMenu = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const { locations } = useSelector((state: RootState) => state.locations);

    return (
        <div className='shadow'>
            <div className='px-5 py-4 bg-sky-700 rounded-t-xl flex flex-col gap-1'>
                <span className='text-xl text-white'>Logged in: {user?.name}</span>
                <span className='text-white text-base'><i className="fa fa-envelope"></i> {user?.email}</span>
            </div>
            <div className='px-5 py-8 flex flex-col gap-4 bg-gray-300 prose prose-a:m-0 prose-a:shadow prose-a:px-3 prose-a:py-2 prose-a:bg-sky-700
             prose-a:text-white hover:prose-a:bg-sky-100 hover:prose-a:text-black prose-a:rounded-md prose-a:no-underline prose-a:cursor-pointer
              prose-a:font-semibold'>
                <Link to='/students'>Students</Link>
                <Link to='/teachers'>Teachers</Link>
                <Link to='/classrooms'>Classrooms</Link>
                <div className='flex flex-col'>
                    <span className='font-bold'><i className="fa-solid fa-gear"></i> System Settings</span>
                    <div className='mt-3'>
                        <label className='font-medium'>Locations: </label>
                        <select className='group rounded w-full h-9 px-2'>
                            {locations.map((location) => {
                                return <option key={location.name} value={location.name}>{location.name}</option>
                            })}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeftMenu;