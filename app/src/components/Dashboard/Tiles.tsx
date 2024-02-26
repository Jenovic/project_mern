import React from 'react';

interface TilesProps {
    name: string;
    iconClass: string;
    iconColor: string;
    onclick: () => void;
}

const Tiles: React.FC<TilesProps> = ({ name, iconClass, iconColor, onclick }) => {
    return (
        <div className='bg-gray-50 px-7 py-10 flex flex-col items-center text-xl rounded shadow' onClick={onclick}>
            <span className={`text-${iconColor}`}><i className={iconClass}></i></span>
            <span>{name}</span>
        </div>
    );
}

export default Tiles;