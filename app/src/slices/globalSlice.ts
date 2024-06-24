import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GlobalState {
    showEditModal: boolean;
    showAddModal: boolean;
    updateDisabled: boolean;
    addDisabled: boolean;
}

const initialState: GlobalState = {
    showEditModal: false,
    showAddModal: false,
    updateDisabled: true,
    addDisabled: true,
};

const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        setShowEditModal: (state, action: PayloadAction<boolean>) => { state.showEditModal = action.payload; },
        setShowAddModal: (state, action: PayloadAction<boolean>) => { state.showAddModal = action.payload; },
        setUpdateDisabled: (state, action: PayloadAction<boolean>) => { state.updateDisabled = action.payload },
        setAddDisabled: (state, action: PayloadAction<boolean>) => { state.addDisabled = action.payload },
    }
});

export const { setShowEditModal, setShowAddModal, setUpdateDisabled, setAddDisabled } = globalSlice.actions;

export default globalSlice.reducer;


