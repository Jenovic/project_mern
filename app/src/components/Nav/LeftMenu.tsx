import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

const LeftMenu = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    return (
        <div className='shadow sticky top-20'>
            <div className='px-5 py-4 bg-sky-700 rounded-t-xl flex flex-col gap-1'>
                <span className='text-xl text-white'>Logged in: {user?.name}</span>
                <span className='text-white text-base'><i className="fa fa-envelope"></i> {user?.email}</span>
            </div>
            <div className='px-5 py-8 flex flex-col gap-4 bg-gray-300 prose prose-a:m-0 prose-a:shadow prose-a:px-3 prose-a:py-2 prose-a:bg-sky-700
             prose-a:text-white hover:prose-a:bg-sky-100 hover:prose-a:text-black prose-a:rounded-md prose-a:no-underline prose-a:cursor-pointer
              prose-a:font-semibold'>
                <Link to='/students'><span className="text-white"><i className='fa-solid fa-users'></i></span> Students</Link>
                <Link to='/teachers'><span className="text-white"><i className='fa-solid fa-user'></i></span> Teachers</Link>
                <Link to='/classrooms'><span className="text-white"><i className='fa-solid fa-school'></i></span> Classrooms</Link>
                <div>
                    <h4 className='pb-2'>Admin center <span className="text-black"><i className='fa-solid fa-cog'></i></span></h4>
                    <Link to='/users'><span className="text-white"><i className='fa-solid fa-users'></i></span> User Management</Link>
                </div>
            </div>
        </div>
    )
}

export default LeftMenu;