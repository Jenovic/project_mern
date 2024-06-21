import { useSelector } from 'react-redux';
import { getStudentSvc, updateStudentSvc } from '../../services/students';
import { setLoading, updateStudent, setSelectedStudent } from '../../slices/studentSlice';
import type { RootState } from '../../store';
import EntityCard from '../Entity/EntityCard';

const StudentCard = () => {
    const { selectedStudent } = useSelector((state: RootState) => state.students);
    const { showFormModal } = useSelector((state: RootState) => state.global);

    return (
        <>
            {showFormModal && (

                <EntityCard
                    entityName="Student"
                    fetchSvc={getStudentSvc}
                    updateSvc={updateStudentSvc}
                    updateEntity={updateStudent}
                    setLoading={setLoading}
                    setSelectedEntity={setSelectedStudent}
                    selectedEntity={selectedStudent}
                />
            )}
        </>
    )
}

export default StudentCard;
