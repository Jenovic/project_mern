import { configureStore, combineReducers } from '@reduxjs/toolkit';
import alertReducer from './slices/alertSlice';
import authReducer from './slices/authSlice';
import studentReducer from './slices/studentSlice';
import teacherReducer from './slices/teacherSlice';
import classroomReducer from './slices/classroomSlice';
import globalReducer from './slices/globalSlice';
import locationReducer from './slices/locationSlice';

const rootReducer = combineReducers({
    alerts: alertReducer,
    auth: authReducer,
    students: studentReducer,
    teachers: teacherReducer,
    classrooms: classroomReducer,
    global: globalReducer,
    locations: locationReducer
})

const store = configureStore({
    reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;