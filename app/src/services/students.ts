import axios from 'axios';

export const getStudentsSvc = async () => {
    const config = {
        headers: {
            'x-auth-token': localStorage.token
        }
    };
    const res = await axios.get('api/students', config);
    return res;
}