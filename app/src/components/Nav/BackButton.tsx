import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

interface BackButtonProps {
    setLoading: (loading: boolean) => any;
}

const BackButton: React.FC<BackButtonProps> = ({ setLoading }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleClick = () => {
        navigate('/dashboard');
        dispatch(setLoading(true));
    }
    return (
        <div>
            <a onClick={handleClick} className="text-black inline-block text-md cursor-pointer bg-sky-300 px-4 py-2 rounded-md font-semibold hover:bg-sky-500">
                <span className='flex items-center gap-1'><i className="fa-solid fa-angles-left"></i> Back to Dashboard</span>
            </a>
        </div>
    )
}

export default BackButton;