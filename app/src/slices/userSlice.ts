import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    _id?: number;
    name: string;
    email: string;
    role: string;
}

interface UserState {
    users: User[];
    fields: [];
    loading: boolean;
    updateDisabled: boolean;
    selectedUser: any;
    userLoading: boolean;
}

const initialState: UserState = {
    users: [],
    fields: [],
    loading: true,
    updateDisabled: true,
    selectedUser: null,
    userLoading: false,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loadUsers: (state, action: PayloadAction<User[]>) => { state.users = action.payload; state.loading = false; },
        updateUser: (state, action: PayloadAction<User>) => { state.loading = false; },
        addUser: (state, action: PayloadAction<User>) => { state.users = [...state.users, action.payload]; state.loading = false; },
        deleteUser: (state, action: PayloadAction<User>) => { },
        setFields: (state, action: PayloadAction<[]>) => { state.fields = action.payload; },
        setLoading: (state, action: PayloadAction<boolean>) => { state.loading = action.payload; },
        setUpdateDisabled: (state, action: PayloadAction<boolean>) => { state.updateDisabled = action.payload },
        setSelectedUser: (state, action: PayloadAction<any>) => { state.selectedUser = action.payload },
        setUserLoading: (state, action: PayloadAction<boolean>) => { state.userLoading = action.payload; },
    }
});

export const {
    loadUsers,
    updateUser,
    addUser,
    deleteUser,
    setLoading,
    setUpdateDisabled,
    setSelectedUser,
    setUserLoading,
    setFields
} = userSlice.actions;

export default userSlice.reducer;