import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteStudentSvc } from "../../services/students";
import { setLoading, setSelectedStudent } from "../../slices/studentSlice";
import { RootState } from "../../store";
import StudentList from "./StudentList";
import EntityPage from "../Entity/EntityPage";

const Students = () => {
    const { selectedStudent, students, loading } = useSelector((state: RootState) => state.students);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSelectedStudent(students[0]));
    }, [loading]);

    return (
        <>
            <EntityPage
                entityName="Student"
                entities={students}
                selectedEntity={selectedStudent}
                setSelectedEntity={setSelectedStudent}
                setLoading={setLoading}
                deleteSvc={deleteStudentSvc}
                EntityListComponent={StudentList}
            />
        </>
    )
}

export default Students;