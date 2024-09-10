import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "../../store";
import { setLoading, setSelectedUser } from '../../slices/userSlice';
import { deleteUserSvc } from '../../services/users';
import UserList from './UserList';
import EntityPage from "../Entity/EntityPage";

const Users = () => {
    const { selectedUser, users, loading } = useSelector((state: RootState) => state.users);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSelectedUser(users[0]));
    }, [loading]);

    return (
        <>
            <EntityPage
                entityName='User'
                entities={users}
                selectedEntity={selectedUser}
                setSelectedEntity={setSelectedUser}
                setLoading={setLoading}
                deleteSvc={deleteUserSvc}
                EntityListComponent={UserList}
            />
        </>
    )
}

export default Users;