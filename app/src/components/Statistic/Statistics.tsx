import React from 'react';
import { setLoading } from '../../slices/authSlice';
import BackButton from '../Nav/BackButton';

const Statistics = () => {
    return (
        <div className='mx-auto max-w-8xl overflow-hidden px-5 my-16'>
            <BackButton setLoading={setLoading} />
            <div className='flex pl-4 justify-between my-5 flex-col lg:flex-row gap-3'>
                <h1>Insights</h1>
            </div>
        </div>
    );
}

export default Statistics;