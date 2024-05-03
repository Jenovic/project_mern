import axios from 'axios';

export const getTeachersSvc = async () => {
    const config = {
        headers: {
            'x-auth-token': localStorage.token
        }
    };
    const res = await axios.get('api/teachers', config);
    return res;
}