import StudentList from "./StudentList";
import BackButton from "../Nav/BackButton";

const Students = () => {
    return (
        <>
            <div className='container mx-auto my-16'>
                <BackButton />
                <StudentList showFull={true} />

            </div>
        </>
    )
}

export default Students;