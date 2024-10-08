import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Classroom {
    _id?: number;
    name: string;
}

interface ClassroomState {
    classrooms: Classroom[];
    fields: [];
    loading: boolean;
    updateDisabled: boolean;
    selectedClassroom: any;
    classroomLoading: boolean;
}

const initialState: ClassroomState = {
    classrooms: [],
    fields: [],
    loading: true,
    updateDisabled: true,
    selectedClassroom: null,
    classroomLoading: false,
};

const classroomSlice = createSlice({
    name: 'classroom',
    initialState,
    reducers: {
        loadClassrooms: (state, action: PayloadAction<Classroom[]>) => { state.classrooms = action.payload; state.loading = false; },
        updateClassroom: (state, action: PayloadAction<Classroom>) => { state.loading = false; },
        addClassroom: (state, action: PayloadAction<Classroom>) => { state.classrooms = [...state.classrooms, action.payload]; state.loading = false; },
        deleteClassroom: (state, action: PayloadAction<Classroom>) => { },
        setFields: (state, action: PayloadAction<[]>) => { state.fields = action.payload; },
        setLoading: (state, action: PayloadAction<boolean>) => { state.loading = action.payload; },
        setUpdateDisabled: (state, action: PayloadAction<boolean>) => { state.updateDisabled = action.payload },
        setSelectedClassroom: (state, action: PayloadAction<any>) => { state.selectedClassroom = action.payload },
        setClassroomLoading: (state, action: PayloadAction<boolean>) => { state.classroomLoading = action.payload; },
    }
});

export const {
    loadClassrooms,
    updateClassroom,
    addClassroom,
    deleteClassroom,
    setLoading,
    setUpdateDisabled,
    setSelectedClassroom,
    setClassroomLoading,
    setFields
} = classroomSlice.actions;

export default classroomSlice.reducer;