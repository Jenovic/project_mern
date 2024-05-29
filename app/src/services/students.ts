import axios from 'axios';

export const getStudentsSvc = async (page = 1, limit = 10) => {
    const config = {
        headers: {
            'x-auth-token': localStorage.token
        },
        params: {
            page,
            limit
        }
    };
    const res = await axios.get('api/students', config);
    return res;
}