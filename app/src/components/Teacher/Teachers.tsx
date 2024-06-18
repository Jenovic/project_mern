import TeacherList from "./TeacherList";
import BackButton from "../Nav/BackButton";

const Teachers = () => {
    return (
        <>
            <div className='mx-auto max-w-8xl overflow-hidden px-5 my-16'>
                <BackButton />
                <TeacherList showFull={true} />

            </div>
        </>
    )
}

export default Teachers