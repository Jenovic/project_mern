import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface Responsable {
    name: string;
    middleName?: string;
    surname: string;
    phoneNumber: string;
    address: string;
    email: string;
    relationshipToStudent: string;
}

interface Student {
    name: string;
    middleName?: string;
    surname: string;
    dob: Date;
    address: string;
    phoneNumber?: string;
    responsables: Responsable[];
}

interface StudentState {
    students: Student[];
    loading: boolean,
    updateDisabled: boolean,
}

const initialState: StudentState = {
    students: [],
    loading: true,
    updateDisabled: true,
};

const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {
        loadStudents: (state, action: PayloadAction<Student[]>) => {
            return {
                ...state,
                students: action.payload,
                loading: false,
            }
        },
        updateStudent: (state, action: PayloadAction<Student>) => {
            return {
                ...state,
                loading: false,
            }
        },
        deleteStudent: (state, action: PayloadAction<Student>) => { },
        setLoading: (state, action: PayloadAction<boolean>) => { state.loading = action.payload; },
        setUpdateDisabled: (state, action: PayloadAction<boolean>) => { state.updateDisabled = action.payload }
    }
});

export const { loadStudents, updateStudent, deleteStudent, setLoading, setUpdateDisabled } = studentSlice.actions;

export default studentSlice.reducer;