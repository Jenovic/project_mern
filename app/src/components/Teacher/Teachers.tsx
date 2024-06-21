import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { setLoading, setSelectedTeacher } from "../../slices/teacherSlice";
import { deleteTeacherSvc } from "../../services/teachers";
import TeacherList from "./TeacherList";
import EntityPage from "../Entity/EntityPage";

const Teachers = () => {
    const { selectedTeacher, teachers } = useSelector((state: RootState) => state.teachers);
    return (
        <>
            <EntityPage
                entityName="Teacher"
                entities={teachers}
                selectedEntity={selectedTeacher}
                setSelectedEntity={setSelectedTeacher}
                setLoading={setLoading}
                deleteSvc={deleteTeacherSvc}
                EntityListComponent={TeacherList}
            />
        </>
    )
}

export default Teachers