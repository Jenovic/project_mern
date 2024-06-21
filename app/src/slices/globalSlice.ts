import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GlobalState {
    showFormModal: boolean;
    updateDisabled: boolean;
}

const initialState: GlobalState = {
    showFormModal: false,
    updateDisabled: true,
};

const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        setShowFormModal: (state, action: PayloadAction<boolean>) => { state.showFormModal = action.payload; },
        setUpdateDisabled: (state, action: PayloadAction<boolean>) => { state.updateDisabled = action.payload },
    }
});

export const { setShowFormModal, setUpdateDisabled } = globalSlice.actions;

export default globalSlice.reducer;


