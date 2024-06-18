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

    try {
        const res = await axios.get('api/students', config);
        return res;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
}

export const getStudentSvc = async (studentId: number) => {
    const config = {
        headers: {
            'x-auth-token': localStorage.token,
        },
    };

    try {
        const res = await axios.get(`api/students/${studentId}`, config);
        return res;
    } catch (error) {
        console.error('Error fetching student:', error);
        throw error;
    }
}

export const updateStudentSvc = async (studentId: number, studentData: {}) => {
    const config = {
        headers: {
            'x-auth-token': localStorage.token,
            'Content-Type': 'application/json'
        },
    };

    try {
        const res = await axios.put(`api/students/${studentId}`, studentData, config);
        return res;
    } catch (error) {
        console.error('Error updating student:', error);
        throw error;
    }
}