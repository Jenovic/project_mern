import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GlobalState {
    showEditModal: boolean;
    showAddModal: boolean;
    updateDisabled: boolean;
    addDisabled: boolean;
    addResponsableDisabled: boolean;
}

const initialState: GlobalState = {
    showEditModal: false,
    showAddModal: false,
    updateDisabled: true,
    addDisabled: true,
    addResponsableDisabled: true,
};

const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        setShowEditModal: (state, action: PayloadAction<boolean>) => { state.showEditModal = action.payload; },
        setShowAddModal: (state, action: PayloadAction<boolean>) => { state.showAddModal = action.payload; },
        setUpdateDisabled: (state, action: PayloadAction<boolean>) => { state.updateDisabled = action.payload },
        setAddDisabled: (state, action: PayloadAction<boolean>) => { state.addDisabled = action.payload },
        setAddResponsableDisabled: (state, action: PayloadAction<boolean>) => { state.addResponsableDisabled = action.payload }
    }
});

export const { setShowEditModal, setShowAddModal, setUpdateDisabled, setAddDisabled, setAddResponsableDisabled } = globalSlice.actions;

export default globalSlice.reducer;


