import axios from 'axios';

export const getStudents = async () => {
    const config = {
        headers: {
            'x-auth-token': localStorage.token
        }
    };
    const res = await axios.get('api/students', config);
    return res;
}