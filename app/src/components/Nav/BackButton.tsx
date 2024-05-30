import { Link } from 'react-router-dom';

const BackButton = () => {
    return (
        <div>
            <Link to="/dashboard" className="text-black inline-block text-md bg-sky-300 px-4 py-2 mb-6 rounded-md font-semibold hover:bg-sky-500">
                <span className='flex items-center gap-1'><i className="fa-solid fa-angles-left"></i> Back to Dashboard</span>
            </Link>
        </div>
    )
}

export default BackButton;