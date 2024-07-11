import { useSelector } from 'react-redux';
import { updateTeacherSvc, addTeacherSvc } from '../../services/teachers';
import { setLoading, updateTeacher, setSelectedTeacher, addTeacher } from '../../slices/teacherSlice';
import type { RootState } from '../../store';
import EntityCard from '../Entity/EntityCard';
import EntityCardAdd from '../Entity/EntityCardAdd';

const TeacherCard = () => {
  const { selectedTeacher, fields } = useSelector((state: RootState) => state.teachers);
  const { showEditModal, showAddModal } = useSelector((state: RootState) => state.global);

  return (
    <>
      {showEditModal && (

        <EntityCard
          entityName='Teacher'
          updateSvc={updateTeacherSvc}
          updateEntity={updateTeacher}
          setLoading={setLoading}
          setSelectedEntity={setSelectedTeacher}
          selectedEntity={selectedTeacher}
          fields={fields}
        />
      )}

      {showAddModal && (
        <EntityCardAdd
          entityName="Teacher"
          addSvc={addTeacherSvc}
          addEntity={addTeacher}
          setLoading={setLoading}
          fields={fields}
        />
      )}
    </>
  )
}

export default TeacherCard;