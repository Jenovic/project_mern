import { configureStore, combineReducers } from '@reduxjs/toolkit';
import alertReducer from './slices/alertSlice';
import authReducer from './slices/authSlice';
import studentReducer from './slices/studentSlice';
import teacherReducer from './slices/teacherSlice';

const rootReducer = combineReducers({
    alerts: alertReducer,
    auth: authReducer,
    students: studentReducer,
    teachers: teacherReducer
})

const store = configureStore({
    reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;