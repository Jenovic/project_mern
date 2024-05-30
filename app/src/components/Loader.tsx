import React from 'react';

const Loader = () => {
    return (
        <div className='flex justify-center items-center h-screen'>
            <div className="animate-spin rounded-full border-t-4 border-sky-500  border-solid h-12 w-12"></div>
        </div>
    )
}

export default Loader;