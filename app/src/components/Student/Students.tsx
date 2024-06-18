import StudentList from "./StudentList";
import BackButton from "../Nav/BackButton";

const Students = () => {
    return (
        <>
            <div className='mx-auto max-w-8xl overflow-hidden px-5 my-16'>
                <BackButton />
                <StudentList showFull={true} />
            </div>
        </>
    )
}

export default Students;