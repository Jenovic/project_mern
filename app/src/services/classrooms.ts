import axios from 'axios';

export const getClassroomsSvc = async (page = 1, limit = 10) => {
    const config = {
        headers: {
            'x-auth-token': localStorage.token
        },
        params: {
            page,
            limit
        }
    };

    try {
        const res = await axios.get('api/classes', config);
        return res;
    } catch (error) {
        console.error('Error fetching classrooms:', error);
        throw error;
    }
}

export const getClassroomSvc = async (classroomId: number) => {
    const config = {
        headers: {
            'x-auth-token': localStorage.token,
        },
    };

    try {
        const res = await axios.get(`api/classes/${classroomId}`, config);
        return res;
    } catch (error) {
        console.error('Error fetching classroom:', error);
        throw error;
    }
}

export const addClassroomSvc = async (classroomdata: {}) => {
    const config = {
        headers: {
            'x-auth-token': localStorage.token,
            'Content-Type': 'application/json'
        },
    }

    try {
        const res = await axios.post('api/classes/', classroomdata, config);
        return res;
    } catch (error) {
        console.error('Error adding classroom:', error);
        throw error;
    }
}

export const updateClassroomSvc = async (classroomId: number, classroomdata: {}) => {
    const config = {
        headers: {
            'x-auth-token': localStorage.token,
            'Content-Type': 'application/json'
        },
    };

    try {
        const res = await axios.put(`api/classes/${classroomId}`, classroomdata, config);
        return res;
    } catch (error) {
        console.error('Error updating classroom:', error);
        throw error;
    }
}

export const deleteClassroomSvc = async (classroomId: number) => {
    const config = {
        headers: {
            'x-auth-token': localStorage.token,
        },
    };

    try {
        const res = await axios.delete(`api/classes/${classroomId}`, config);
        return res;
    } catch (error) {
        console.error('Error deleting classroom:', error);
        throw error;
    }
}