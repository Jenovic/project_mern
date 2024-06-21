import { useSelector } from "react-redux";
import { deleteStudentSvc } from "../../services/students";
import { setLoading, setSelectedStudent } from "../../slices/studentSlice";
import { RootState } from "../../store";
import StudentList from "./StudentList";
import EntityPage from "../Entity/EntityPage";

const Students = () => {
    const { selectedStudent, students } = useSelector((state: RootState) => state.students);

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