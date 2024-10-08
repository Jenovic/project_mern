import React from 'react';
import { useNavigate } from 'react-router-dom';

interface PaginationProps {
    showFull: boolean;
    page: number;
    totalPages: number;
    seeMoreURL: string;
    onPageChange: (page: number) => void;
    setLoading: (loading: boolean) => any;
}

const Pagination: React.FC<PaginationProps> = ({ showFull, page, totalPages, seeMoreURL, onPageChange, setLoading }) => {
    const navigate = useNavigate();

    const handleNextPage = () => {
        if (page < totalPages) {
            onPageChange(page + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            onPageChange(page - 1);
        }
    };

    const handleClick = () => {
        setLoading(true);
        navigate(seeMoreURL);
    }

    return (
        <>
            {showFull &&
                <div className="flex justify-center mt-4 gap-3">
                    <button
                        className={`px-4 py-2 ${page === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-sky-300 cursor-pointer'} rounded`}
                        onClick={handlePreviousPage}
                        disabled={page === 1}
                    >
                        <i className="fa-solid fa-angle-left"></i>
                    </button>
                    <button
                        className={`px-4 py-2 ${page === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-sky-300 cursor-pointer'} rounded`}
                        onClick={handleNextPage}
                        disabled={page === totalPages}
                    >
                        <i className="fa-solid fa-angle-right"></i>
                    </button>
                </div>
            }
            {!showFull &&
                <div className='mt-5 flex justify-end'>
                    <a className="text-black inline-block text-md bg-sky-300 px-4 py-2 rounded-md font-semibold hover:bg-sky-500 cursor-pointer" onClick={() => handleClick()}>
                        <span className='flex items-center gap-1'>See more <i className="fa-solid fa-angles-right"></i></span>
                    </a>
                </div>
            }
        </>
    )
}

export default Pagination