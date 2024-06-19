export const determineType = (s: string) => {
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
            res = 'text';
            break;
        default:
            res = 'text';
    }
    return res;
}