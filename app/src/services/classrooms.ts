import axios from 'axios';

export const getClassroomsSvc = async () => {
    const config = {
        headers: {
            'x-auth-token': localStorage.token
        }
    };
    const res = await axios.get('api/classes', config);
    return res;
}