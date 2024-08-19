export const determineType = (s: string, name?: string) => {
    console.log(name);
    let res = '';
    switch (s) {
        case 'String':
            res = 'text';
            break;
        case 'Date':
            res = 'date';
            break;
        case 'Number':
            res = 'number';
            break;
        case 'ObjectId':
            // Check if the field name corresponds to 'class' or 'location'
            if (name === 'class' || name === 'location') {
                console.log('here!!!!');
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
