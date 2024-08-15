import { configureStore } from "@reduxjs/toolkit";
import { PreloadedState } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getStudentSvc } from "../services/students";
import authReducer from '../slices/authSlice';
import studentReducer from '../slices/studentSlice';
import teacherReducer from '../slices/teacherSlice';
import globalReducer from '../slices/globalSlice';

export const createMockStore = (preloadedState?: PreloadedState<RootState>) => {
    return configureStore({
        reducer: {
            auth: authReducer,
            students: studentReducer,
            teachers: teacherReducer,
            global: globalReducer
        },
        preloadedState,
    })
}

export const mockGetStudentsSvc = jest.fn();

export const mockGetTeachersSvc = jest.fn();

export const setupMockGetStudentsSvc = (mockData?: any) => {
    mockGetStudentsSvc.mockResolvedValueOnce({
        data: {
            students: mockData || [
                { id: '1', name: 'John', middleName: 'A', surname: 'Doe', dob: new Date('2000-02-01'), address: '123 Main St', phoneNumber: '1234567890', responsables: [] },
                { id: '2', name: 'Jane', middleName: 'B', surname: 'Doe', dob: new Date('2000-02-01'), address: '456 Main St', phoneNumber: '0987654321', responsables: [] },
                { id: '3', name: 'Jim', middleName: 'C', surname: 'Beam', dob: new Date('2000-02-01'), address: '789 Main St', phoneNumber: '1122334455', responsables: [] },
                { id: '4', name: 'Jack', middleName: 'D', surname: 'Daniels', dob: new Date('2000-02-01'), address: '101 Main St', phoneNumber: '5566778899', responsables: [] },
                { id: '5', name: 'Johnny', middleName: 'E', surname: 'Walker', dob: new Date('2000-02-01'), address: '202 Main St', phoneNumber: '6677889900', responsables: [] }
            ],
            fieldTypes: [],
            pages: 1,
        },
    });
}

export const setupMockGetTeachersSvc = (mockData?: any) => {
    mockGetTeachersSvc.mockResolvedValueOnce({
        data: {
            teachers: mockData || [
                { id: '1', name: 'John', middleName: 'A', surname: 'Doe', dob: new Date('2000-02-01'), address: '123 Main St', phoneNumber: '1234567890', email: 'zula@hotmail.com' },
                { id: '2', name: 'Jane', middleName: 'B', surname: 'Doe', dob: new Date('2000-02-01'), address: '456 Main St', phoneNumber: '0987654321', email: 'zula@hotmail.com' },
                { id: '3', name: 'Jim', middleName: 'C', surname: 'Beam', dob: new Date('2000-02-01'), address: '789 Main St', phoneNumber: '1122334455', email: 'zula@hotmail.com' },
                { id: '4', name: 'Jack', middleName: 'D', surname: 'Daniels', dob: new Date('2000-02-01'), address: '101 Main St', phoneNumber: '5566778899', email: 'zula@hotmail.com' },
                { id: '5', name: 'Johnny', middleName: 'E', surname: 'Walker', dob: new Date('2000-02-01'), address: '202 Main St', phoneNumber: '6677889900', email: 'zula@hotmail.com' }
            ],
            fieldTypes: [],
            pages: 1
        }
    })
}

export const setupAllMockServices = () => {
    jest.mock('../services/students', () => ({
        getStudentSvc: mockGetStudentsSvc
    }));
    jest.mock('../services/teachers', () => ({
        getTeacherSvc: mockGetTeachersSvc
    }));
}