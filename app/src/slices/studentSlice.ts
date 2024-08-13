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

export interface Student {
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
    fields: [];
    responsibleFields: [];
    loading: boolean,
    updateDisabled: boolean,
    selectedStudent: any,
    studentLoading: boolean,
}

const initialState: StudentState = {
    students: [],
    fields: [],
    responsibleFields: [],
    loading: true,
    updateDisabled: true,
    selectedStudent: null,
    studentLoading: false,
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
        addStudent: (state, action: PayloadAction<Student>) => {
            return {
                ...state,
                students: [...state.students, action.payload],
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
        setFields: (state, action: PayloadAction<[]>) => {
            return {
                ...state,
                fields: action.payload,
            }
        },
        setResponsibleFields: (state, action: PayloadAction<[]>) => {
            return {
                ...state,
                responsibleFields: action.payload,
            }
        },
        setLoading: (state, action: PayloadAction<boolean>) => { state.loading = action.payload; },
        setUpdateDisabled: (state, action: PayloadAction<boolean>) => { state.updateDisabled = action.payload },
        setSelectedStudent: (state, action: PayloadAction<any>) => { state.selectedStudent = action.payload },
        setStudentLoading: (state, action: PayloadAction<boolean>) => { state.studentLoading = action.payload; },
    }
});

export const {
    loadStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    setLoading,
    setUpdateDisabled,
    setSelectedStudent,
    setStudentLoading,
    setFields,
    setResponsibleFields
} = studentSlice.actions;

export default studentSlice.reducer;