import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Alert {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}

const initialState: Alert[] = [];

const alertSlice = createSlice({
    name: 'alert',
    initialState,
    reducers: {
        setAlert: (state, action: PayloadAction<Alert>) => {
            state.push(action.payload);
        },
        removeAlert: (state, action: PayloadAction<string>) => {
            return state.filter((alert) => alert.id !== action.payload);
        },
    },
});

export const { setAlert, removeAlert } = alertSlice.actions;

export default alertSlice.reducer;