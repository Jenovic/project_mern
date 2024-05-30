import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Auth {
    token: string;
    isAuthenticated?: boolean;
    loading?: boolean;
    user?: any;
}

const initialState: Auth = {
    token: localStorage.getItem('token') || '',
    isAuthenticated: false,
    loading: false,
    user: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<Auth>) => {
            const { token } = action.payload;
            localStorage.setItem('token', token);
            return {
                ...state,
                token,
                isAuthenticated: true,
                loading: false,
            };
        },
        loadUser: (state, action: PayloadAction<Auth>) => {
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: action.payload,
            }
        },
        authError: (state) => {
            localStorage.removeItem('token');
            return {
                ...state,
                token: '',
                loading: false,
            };
        },
        loginError: (state) => {
            localStorage.removeItem('token');
            return {
                ...state,
                token: '',
                loading: false,
            };
        },
        logout: (state) => {
            localStorage.removeItem('token');
            return {
                ...state,
                token: '',
                isAuthenticated: false,
                loading: false,
            };
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        }
    },
});

export const { loginSuccess, loginError, loadUser, authError, logout, setLoading } = authSlice.actions;

export default authSlice.reducer;