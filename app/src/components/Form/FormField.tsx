import React from 'react';
import { determineType } from '../../utils/helpers';

interface Field {
    name: string;
    type: string;
    required: boolean;
}

interface FormFieldProps {
    field: Field;
    value: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormField: React.FC<FormFieldProps> = ({ field, value, onChange }) => {
    return (
        <div key={field.name} className="mb-4 grid md:grid-cols-12 items-center">
            <label className="block col-span-3 text-gray-700 text-sm text-left font-bold mb-2" htmlFor={field.name}>
                {field.name}
                <span className='text-red-500'>{field.required && ' *'}</span>
            </label>
            <input
                id={field.name}
                name={field.name}
                type={determineType(field.type)}
                value={field.type === 'Date' ? (value || '').split('T')[0] : (value || '')}
                onChange={onChange}
                required={field.required}
                readOnly={field.name === '_id' || field.name === 'dateCreated' || field.name === 'dateModified'}
                className={`col-span-9 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none
                    focus:shadow-outline ${field.name === '_id' || field.name === 'dateCreated' || field.name === 'dateModified' ? 'bg-gray-200 cursor-not-allowed' : ''
                    }`}
            />
        </div>
    );
};

export default FormField;
