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
    onChange: any;
    options?: { value: string, label: string }[] | undefined; // Add options prop for select fields
}

const FormField: React.FC<FormFieldProps> = ({ field, value, onChange, options }) => {
    let fieldValue = value;

    if (field.type === 'ObjectId' && typeof value === 'object' && value !== null) {
        fieldValue = value._id ?? '';
    }

    if (field.type === 'Date') {
        fieldValue = (value || '').split('T')[0];
    }

    const inputType = determineType(field.type, field.name);

    // Handle changes for input fields
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e);
    };

    // Handle changes for select fields
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(e);
    };

    return (
        <div key={field.name} className="mb-4 grid md:grid-cols-12 items-center">
            <label className="block col-span-3 text-gray-700 text-sm text-left font-bold mb-2" htmlFor={field.name}>
                {field.name}
                <span className='text-red-500'>{field.required && ' *'}</span>
            </label>
            {inputType === 'select' && options ? (
                <select
                    id={field.name}
                    name={field.name}
                    value={fieldValue || ' '}
                    onChange={handleSelectChange}
                    required={field.required}
                    className="col-span-9 shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight border-r-8 border-transparent focus:outline-none focus:shadow-outline"
                >
                    <option value="">Please select ...</option>
                    {options?.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    id={field.name}
                    name={field.name}
                    type={inputType}
                    value={fieldValue || ''}
                    onChange={handleInputChange}
                    required={field.required}
                    readOnly={field.name === '_id' || field.name === 'dateCreated' || field.name === 'dateModified' || field.name === 'status'}
                    className={`col-span-9 shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline 
                        ${field.name === '_id' || field.name === 'dateCreated' || field.name === 'dateModified' || field.name === 'status'
                            ? 'bg-gray-200 cursor-not-allowed'
                            : ''
                        }`}
                />
            )}
        </div>
    );
};

export default FormField;
