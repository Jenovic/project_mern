import { useSelector } from 'react-redux';
import { updateUserSvc, registerUserSvc } from '../../services/users';
import { setLoading, updateUser, setSelectedUser, addUser } from '../../slices/userSlice';
import type { RootState } from '../../store';
import EntityCard from '../Entity/EntityCard';
import EntityCardAdd from '../Entity/EntityCardAdd';

const UserCard = () => {
    const { selectedUser, fields } = useSelector((state: RootState) => state.users);
    const { showEditModal, showAddModal } = useSelector((state: RootState) => state.global);

    return (
        <>
            {showEditModal && (

                <EntityCard
                    entityName='User'
                    updateSvc={updateUserSvc}
                    updateEntity={updateUser}
                    setLoading={setLoading}
                    setSelectedEntity={setSelectedUser}
                    selectedEntity={selectedUser}
                    fields={fields}
                />
            )}

            {showAddModal && (
                <EntityCardAdd
                    entityName="User"
                    addSvc={registerUserSvc}
                    addEntity={addUser}
                    setLoading={setLoading}
                    fields={fields}
                />
            )}
        </>
    );
}

export default UserCard