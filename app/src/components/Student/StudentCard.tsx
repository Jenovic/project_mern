import { useSelector } from 'react-redux';
import { addStudentSvc, updateStudentSvc } from '../../services/students';
import { setLoading, updateStudent, setSelectedStudent, addStudent } from '../../slices/studentSlice';
import type { RootState } from '../../store';
import EntityCard from '../Entity/EntityCard';
import EntityCardAdd from '../Entity/EntityCardAdd';

const StudentCard = () => {
    const { selectedStudent, fields } = useSelector((state: RootState) => state.students);
    const { showEditModal, showAddModal } = useSelector((state: RootState) => state.global);

    return (
        <>
            {showEditModal && (

                <EntityCard
                    entityName="Student"
                    updateSvc={updateStudentSvc}
                    updateEntity={updateStudent}
                    setLoading={setLoading}
                    setSelectedEntity={setSelectedStudent}
                    selectedEntity={selectedStudent}
                    fields={fields}
                />
            )}

            {showAddModal && (
                <EntityCardAdd
                    entityName="Student"
                    addSvc={addStudentSvc}
                    addEntity={addStudent}
                    setLoading={setLoading}
                    fields={fields}
                />
            )}
        </>
    )
}

export default StudentCard;
