import TeacherList from "./TeacherList";
import BackButton from "../Nav/BackButton";

const Teachers = () => {
    return (
        <>
            <div className='container mx-auto my-16'>
                <BackButton />
                <TeacherList showFull={true} />

            </div>
        </>
    )
}

export default Teachers