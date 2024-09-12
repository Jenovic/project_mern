import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Auth {
    token: string;
    isAuthenticated?: boolean;
    loading?: boolean;
    user?: any;
}

const initialState: Auth = {
    token: localStorage.getItem('token') || '',
    isAuthenticated: false,
    loading: true,
    user: null,
}

const saveTokenToLocalStorage = (token: string) => localStorage.setItem('token', token);
const removeTokenFromLocalStorage = () => localStorage.removeItem('token');

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<Auth>) => {
            const { token } = action.payload;
            saveTokenToLocalStorage(token);
            state.token = token;
            state.isAuthenticated = true;
        },
        loadUser: (state, action: PayloadAction<Auth>) => {
            state.isAuthenticated = true;
            state.loading = false;
            state.user = action.payload;
        },
        authError: (state) => {
            removeTokenFromLocalStorage();
            state.token = '';
            state.isAuthenticated = false;
            state.loading = false;
        },
        loginError: (state) => {
            removeTokenFromLocalStorage();
            state.token = '';
            state.isAuthenticated = false;
            state.loading = false;
        },
        logout: (state) => {
            removeTokenFromLocalStorage();
            state.token = '';
            state.isAuthenticated = false;
            state.loading = false;
            state.user = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        }
    },
});

export const { loginSuccess, loginError, loadUser, authError, logout, setLoading } = authSlice.actions;

export default authSlice.reducer;