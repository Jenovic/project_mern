import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Teacher {
    name: string;
    middleName?: string;
    surname: string;
    dob: Date;
    address: string;
    phoneNumber: string;
    email?: string;
}

interface TeacherState {
    teachers: Teacher[];
    fields: [];
    loading: boolean,
    updateDisabled: boolean,
    selectedTeacher: any,
    teacherLoading: boolean,
}

const initialState: TeacherState = {
    teachers: [],
    fields: [],
    loading: true,
    updateDisabled: true,
    selectedTeacher: null,
    teacherLoading: false,
};

const teacherSlice = createSlice({
    name: 'teacher',
    initialState,
    reducers: {
        loadTeachers: (state, action: PayloadAction<Teacher[]>) => { state.teachers = action.payload; },
        addTeacher: (state, action: PayloadAction<Teacher>) => {
            state.teachers = [...state.teachers, action.payload];
            state.loading = false;
        },
        updateTeacher: (state, action: PayloadAction<Teacher>) => { state.loading = false; },
        deleteTeacher: (state, action: PayloadAction<Teacher>) => { },
        setFields: (state, action: PayloadAction<[]>) => { state.fields = action.payload; },
        setLoading: (state, action: PayloadAction<boolean>) => { state.loading = action.payload; },
        setUpdateDisabled: (state, action: PayloadAction<boolean>) => { state.updateDisabled = action.payload },
        setSelectedTeacher: (state, action: PayloadAction<any>) => { state.selectedTeacher = action.payload },
        setTeacherLoading: (state, action: PayloadAction<boolean>) => { state.teacherLoading = action.payload; },
    }
});

export const { loadTeachers, updateTeacher, deleteTeacher, setLoading, setUpdateDisabled, setSelectedTeacher, setTeacherLoading, addTeacher, setFields } = teacherSlice.actions;

export default teacherSlice.reducer;