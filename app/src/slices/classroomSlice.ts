import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Classroom {
    name: string;
}

interface ClassroomState {
    classrooms: Classroom[];
}

const initialState: ClassroomState = {
    classrooms: []
};

const classroomSlice = createSlice({
    name: 'classroom',
    initialState,
    reducers: {
        loadClassrooms: (state, action: PayloadAction<Classroom[]>) => {
            return {
                ...state,
                classrooms: action.payload,
            }
        },
        updateClassroom: (state, action: PayloadAction<Classroom>) => { },
        deleteClassroom: (state, action: PayloadAction<Classroom>) => { },
    }
});

export const { loadClassrooms, updateClassroom, deleteClassroom } = classroomSlice.actions;

export default classroomSlice.reducer;