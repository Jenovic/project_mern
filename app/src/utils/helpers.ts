import CryptoJS from 'crypto-js';

export const determineType = (s: string, name?: string) => {
    let res = '';
    switch (s) {
        case 'String':
            if (name === 'gender' || name === 'relationshipToStudent') {
                res = 'select';
            } else {
                res = 'text';
            }
            break;
        case 'Date':
            res = 'date';
            break;
        case 'Number':
            res = 'number';
            break;
        case 'ObjectId':
            if (name === 'class' || name === 'location' || name === 'gender') {
                res = 'select';
            } else {
                res = 'text';
            }
            break;
        default:
            res = 'text';
    }
    return res;
}


export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const genderOptions = [
    { value: 'male', label: 'male' },
    { value: 'female', label: 'female' },
];

export const relationshipOptions = [
    { value: 'father', label: 'father' },
    { value: 'mother', label: 'mother' },
    { value: 'sibling', label: 'sibling' },
    { value: 'relative', label: 'relative' },
    { value: 'sponsor', label: 'sponsor' },
]


export const decryptFn = (data: string) => {
    const bytes = CryptoJS.AES.decrypt(data, '*****************');
    return bytes.toString(CryptoJS.enc.Utf8);
}