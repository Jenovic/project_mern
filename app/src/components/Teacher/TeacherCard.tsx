import { useSelector } from 'react-redux';
import { getTeacherSvc, updateTeacherSvc } from '../../services/teachers';
import { setLoading, updateTeacher, setSelectedTeacher } from '../../slices/teacherSlice';
import type { RootState } from '../../store';
import EntityCard from '../Entity/EntityCard';

const TeacherCard = () => {
  const { selectedTeacher } = useSelector((state: RootState) => state.teachers);

  return (
    <EntityCard
      entityName='Teacher'
      fetchSvc={getTeacherSvc}
      updateSvc={updateTeacherSvc}
      updateEntity={updateTeacher}
      setLoading={setLoading}
      setSelectedEntity={setSelectedTeacher}
      selectedEntity={selectedTeacher}
    />
  )
}

export default TeacherCard;