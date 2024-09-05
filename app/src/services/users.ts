import axios from 'axios';

export const registerUserSvc = async (userData: {}) => {
    const config = {
        headers: {
            'x-auth-token': localStorage.token,
            'Content-Type': 'application/json'
        },
    };

    try {
        const res = await axios.post('api/users/', userData, config);
        return res;
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
}

export const updateUserSvc = async (userId: string, userData: {}) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        },
    };

    try {
        const res = await axios.put(`api/users/${userId}`, userData, config);
        return res;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

export const getUserSvc = async (userId: string) => {
    try {
        const res = await axios.get(`api/users/${userId}`);
        return res;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}