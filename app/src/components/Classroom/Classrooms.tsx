import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { setLoading, setSelectedClassroom } from "../../slices/classroomSlice";
import { deleteClassroomSvc } from "../../services/classrooms";
import ClassroomList from "./ClassroomList";
import EntityPage from "../Entity/EntityPage";

const Classrooms = () => {
    const { selectedClassroom, classrooms, loading } = useSelector((state: RootState) => state.classrooms);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSelectedClassroom(classrooms[0]));
    }, [loading]);

    return (
        <>
            <EntityPage
                entityName="Classroom"
                entities={classrooms}
                selectedEntity={selectedClassroom}
                setSelectedEntity={setSelectedClassroom}
                setLoading={setLoading}
                deleteSvc={deleteClassroomSvc}
                EntityListComponent={ClassroomList}
            />
        </>
    )
}

export default Classrooms;