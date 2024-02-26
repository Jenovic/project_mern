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
    // class?: IClass;
}

const initialState: Student[] = [];

const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {
        loadStudents: (state, action: PayloadAction<Student>) => {
            return [...state, action.payload]
        },
        updateStudent: (state, action: PayloadAction<Student>) => { },
        deleteStudent: (state, action: PayloadAction<Student>) => { },
    }
});

export const { loadStudents, updateStudent, deleteStudent } = studentSlice.actions;

export default studentSlice.reducer;