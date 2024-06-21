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
    loading: boolean,
    updateDisabled: boolean,
    selectedTeacher: any,
    teacherLoading: boolean,
}

const initialState: TeacherState = {
    teachers: [],
    loading: true,
    updateDisabled: true,
    selectedTeacher: null,
    teacherLoading: false,
};

const teacherSlice = createSlice({
    name: 'teacher',
    initialState,
    reducers: {
        loadTeachers: (state, action: PayloadAction<Teacher[]>) => {
            return {
                ...state,
                teachers: action.payload,
            }
        },
        updateTeacher: (state, action: PayloadAction<Teacher>) => {
            return {
                ...state,
                loading: false,
            }
        },
        deleteTeacher: (state, action: PayloadAction<Teacher>) => { },
        setLoading: (state, action: PayloadAction<boolean>) => { state.loading = action.payload; },
        setUpdateDisabled: (state, action: PayloadAction<boolean>) => { state.updateDisabled = action.payload },
        setSelectedTeacher: (state, action: PayloadAction<any>) => { state.selectedTeacher = action.payload },
        setTeacherLoading: (state, action: PayloadAction<boolean>) => { state.teacherLoading = action.payload; },
    }
});

export const { loadTeachers, updateTeacher, deleteTeacher, setLoading, setUpdateDisabled, setSelectedTeacher, setTeacherLoading } = teacherSlice.actions;

export default teacherSlice.reducer;