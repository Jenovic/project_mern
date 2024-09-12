import axios from 'axios';

export const getTeachersSvc = async (page = 1, limit = 10, filterLocation = '', filterClassroom = '') => {
    const config = {
        headers: {
            'x-auth-token': localStorage.token
        },
        params: {
            page,
            limit,
            class: filterClassroom,
            location: filterLocation
        }
    };

    try {

        const res = await axios.get('api/teachers', config);
        return res;
    } catch (error) {
        console.error('Error fetching teachers:', error);
        throw error;
    }
}

export const getTeacherSvc = async (teacherId: number) => {
    const config = {
        headers: {
            'x-auth-token': localStorage.token,
        },
    };

    try {
        const res = await axios.get(`api/teachers/${teacherId}`, config);
        return res;
    } catch (error) {
        console.error('Error fetching teacher:', error);
        throw error;
    }
}

export const addTeacherSvc = async (teacherdata: {}) => {
    const config = {
        headers: {
            'x-auth-token': localStorage.token,
            'Content-Type': 'application/json'
        },
    }

    try {
        const res = await axios.post('api/teachers/', teacherdata, config);
        return res;
    } catch (error) {
        console.error('Error adding teacher:', error);
        throw error;
    }
}

export const updateTeacherSvc = async (teacherId: number, teacherData: {}) => {
    const config = {
        headers: {
            'x-auth-token': localStorage.token,
            'Content-Type': 'application/json'
        },
    };

    try {
        const res = await axios.put(`api/teachers/${teacherId}`, teacherData, config);
        return res;
    } catch (error) {
        console.error('Error updating teacher:', error);
        throw error;
    }
}

export const deleteTeacherSvc = async (teacherId: number) => {
    const config = {
        headers: {
            'x-auth-token': localStorage.token,
        },
    };

    try {
        const res = await axios.delete(`api/teachers/${teacherId}`, config);
        return res;
    } catch (error) {
        console.error('Error deleting teacher:', error);
        throw error;
    }
}