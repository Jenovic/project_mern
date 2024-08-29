import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GlobalState {
    showEditModal: boolean;
    showAddModal: boolean;
    updateDisabled: boolean;
    addDisabled: boolean;
    addResponsableDisabled: boolean;
    locationFilter: string;
    classroomFilter: string;
}

const initialState: GlobalState = {
    showEditModal: false,
    showAddModal: false,
    updateDisabled: true,
    addDisabled: true,
    addResponsableDisabled: true,
    locationFilter: '',
    classroomFilter: ''
};

const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        setShowEditModal: (state, action: PayloadAction<boolean>) => { state.showEditModal = action.payload; },
        setShowAddModal: (state, action: PayloadAction<boolean>) => { state.showAddModal = action.payload; },
        setUpdateDisabled: (state, action: PayloadAction<boolean>) => { state.updateDisabled = action.payload },
        setAddDisabled: (state, action: PayloadAction<boolean>) => { state.addDisabled = action.payload },
        setAddResponsableDisabled: (state, action: PayloadAction<boolean>) => { state.addResponsableDisabled = action.payload },
        setLocationFilter: (state, action: PayloadAction<string>) => { state.locationFilter = action.payload; },
        setClassroomFilter: (state, action: PayloadAction<string>) => { state.classroomFilter = action.payload; },
    }
});

export const { setShowEditModal, setShowAddModal, setUpdateDisabled, setAddDisabled, setAddResponsableDisabled, setLocationFilter, setClassroomFilter } = globalSlice.actions;

export default globalSlice.reducer;


