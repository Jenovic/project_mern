import axios from "axios";

export const getLocationsSvc = async () => {
    const config = {
        headers: {
            'x-auth-token': localStorage.token
        },
    };

    try {
        const res = await axios.get('api/locations', config);
        return res;
    } catch (error) {
        console.error('Error fetching locations:', error);
        throw error;
    }
}