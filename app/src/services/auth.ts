import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

export const loginSvc = async (email: string, password: string) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const body = JSON.stringify({ email, password });
    const res = await axios.post('/api/auth', body, config);
    return res;
}

export const loadUserSvc = async () => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }

    const res = await axios.get('/api/auth');
    return res;
}
