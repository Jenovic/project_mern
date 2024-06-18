import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GlobalState {
    showFormModal: boolean;
}

const initialState: GlobalState = {
    showFormModal: false,
};

const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        setShowFormModal: (state, action: PayloadAction<boolean>) => { state.showFormModal = action.payload; },
    }
});

export const { setShowFormModal } = globalSlice.actions;

export default globalSlice.reducer;


