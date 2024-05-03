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
}

const initialState: TeacherState = {
    teachers: []
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
        updateTeacher: (state, action: PayloadAction<Teacher>) => { },
        deleteTeacher: (state, action: PayloadAction<Teacher>) => { },
    }
});

export const { loadTeachers, updateTeacher, deleteTeacher } = teacherSlice.actions;

export default teacherSlice.reducer;