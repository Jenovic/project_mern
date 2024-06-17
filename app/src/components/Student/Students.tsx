import StudentList from "./StudentList";
import BackButton from "../Nav/BackButton";

const Students = () => {
    return (
        <>
            <div className='mx-auto my-16'>
                <BackButton />
                <StudentList showFull={true} />

            </div>
        </>
    )
}

export default Students;