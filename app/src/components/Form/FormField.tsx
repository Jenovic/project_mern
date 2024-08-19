// import React from 'react';
// import { determineType } from '../../utils/helpers';

// interface Field {
//     name: string;
//     type: string;
//     required: boolean;
// }

// interface FormFieldProps {
//     field: Field;
//     value: any;
//     onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }

// const FormField: React.FC<FormFieldProps> = ({ field, value, onChange }) => {
//     let fieldValue;

//     fieldValue = value;

//     if (field.type === 'ObjectId') {
//         if (typeof value === 'object' && value !== null) fieldValue = value.name ?? '';
//     }

//     if (field.type === 'Date') fieldValue = (value || '').split('T')[0];

//     return (
//         <div key={field.name} className="mb-4 grid md:grid-cols-12 items-center">
//             <label className="block col-span-3 text-gray-700 text-sm text-left font-bold mb-2" htmlFor={field.name}>
//                 {field.name}
//                 <span className='text-red-500'>{field.required && ' *'}</span>
//             </label>
//             <input
//                 id={field.name}
//                 name={field.name}
//                 type={determineType(field.type, field.name)}
//                 value={fieldValue || ''}
//                 onChange={onChange}
//                 required={field.required}
//                 readOnly={field.name === '_id' || field.name === 'dateCreated' || field.name === 'dateModified'}
//                 className={`col-span-9 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none
//                     focus:shadow-outline ${field.name === '_id' || field.name === 'dateCreated' || field.name === 'dateModified' ? 'bg-gray-200 cursor-not-allowed' : ''
//                     }`}
//             />
//         </div>
//     );
// };

// export default FormField;



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
    options?: { value: string, label: string }[]; // Add options prop for select fields
}

const FormField: React.FC<FormFieldProps> = ({ field, value, onChange, options }) => {
    let fieldValue = value;

    if (field.type === 'ObjectId' && typeof value === 'object' && value !== null) {
        fieldValue = value.name ?? '';
    }

    if (field.type === 'Date') {
        fieldValue = (value || '').split('T')[0];
    }

    const inputType = determineType(field.type, field.name);

    return (
        <div key={field.name} className="mb-4 grid md:grid-cols-12 items-center">
            <label className="block col-span-3 text-gray-700 text-sm text-left font-bold mb-2" htmlFor={field.name}>
                {field.name}
                <span className='text-red-500'>{field.required && ' *'}</span>
            </label>
            {inputType === 'select' ? (
                <select
                    id={field.name}
                    name={field.name}
                    value={fieldValue || ''}
                    // onChange={onChange as React.ChangeEventHandler<HTMLSelectElement>}
                    required={field.required}
                    className="col-span-9 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="">Please select ...</option>
                    {/* {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))} */}
                </select>
            ) : (
                <input
                    id={field.name}
                    name={field.name}
                    type={inputType}
                    value={fieldValue || ''}
                    onChange={onChange}
                    required={field.required}
                    readOnly={field.name === '_id' || field.name === 'dateCreated' || field.name === 'dateModified'}
                    className={`col-span-9 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${field.name === '_id' || field.name === 'dateCreated' || field.name === 'dateModified'
                        ? 'bg-gray-200 cursor-not-allowed'
                        : ''
                        }`}
                />
            )}
        </div>
    );
};

export default FormField;
