import { useSelector } from 'react-redux';
import { updateClassroomSvc, addClassroomSvc } from '../../services/classrooms';
import { setLoading, updateClassroom, setSelectedClassroom, addClassroom } from '../../slices/classroomSlice';
import type { RootState } from '../../store';
import EntityCard from '../Entity/EntityCard';
import EntityCardAdd from '../Entity/EntityCardAdd';

const ClassroomCard = () => {
    const { selectedClassroom, fields } = useSelector((state: RootState) => state.classrooms);
    const { showEditModal, showAddModal } = useSelector((state: RootState) => state.global);

    return (
        <>
            {showEditModal && (
                <EntityCard
                    entityName='Classroom'
                    updateSvc={updateClassroomSvc}
                    updateEntity={updateClassroom}
                    setLoading={setLoading}
                    setSelectedEntity={setSelectedClassroom}
                    selectedEntity={selectedClassroom}
                    fields={fields}
                />
            )}

            {showAddModal && (
                <EntityCardAdd
                    entityName="Classroom"
                    addSvc={addClassroomSvc}
                    addEntity={addClassroom}
                    setLoading={setLoading}
                    fields={fields}
                />
            )}
        </>
    )
}

export default ClassroomCard;