import React from 'react';
import { useDispatch } from 'react-redux';
import { getUsersSvc } from '../../services/users';
import { loadUsers, setLoading, setSelectedUser, setFields } from '../../slices/userSlice';
import { RootState } from '../../store';
import UserCard from './UserCard';
import EntityList from '../Entity/EntityList';

const UserList: React.FC<{ showFull: boolean }> = ({ showFull }) => {
    const dispatch = useDispatch();

    return (
        <EntityList
            entityName="User"
            fetchSvc={getUsersSvc}
            loadEntities={(users) => dispatch(loadUsers(users))}
            setEntityFields={(fields) => dispatch(setFields(fields))}
            setEntitySubFields={() => { }}
            setLoading={(loading) => dispatch(setLoading(loading))}
            setSelectedEntity={(user) => dispatch(setSelectedUser(user))}
            entitiesSelector={(state: RootState) => state.users.users}
            loadingSelector={(state: RootState) => state.users.loading}
            showFull={showFull}
            columns={[
                { label: 'Name', accessor: 'name' },
                { label: 'Email', accessor: 'email' },
                { label: 'Role', accessor: 'role' },
            ]}
            editComponent={UserCard}
        />
    )
}

export default UserList;