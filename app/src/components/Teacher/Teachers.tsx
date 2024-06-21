import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { setLoading, setSelectedTeacher } from "../../slices/teacherSlice";
import { deleteTeacherSvc } from "../../services/teachers";
import TeacherList from "./TeacherList";
import EntityPage from "../Entity/EntityPage";

const Teachers = () => {
    const { selectedTeacher, teachers, loading } = useSelector((state: RootState) => state.teachers);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSelectedTeacher(teachers[0]));
    }, [loading]);

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