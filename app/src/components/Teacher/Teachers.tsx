import TeacherList from "./TeacherList";

const Teachers = () => {
    return (
        <>
            <div className='container mx-auto my-16'>
                <div><a href="/dashboard" className="text-black inline-block text-md bg-sky-300 px-4 py-2 mb-6 rounded-md font-semibold hover:bg-sky-500">Back to Dashboard</a></div>
                <TeacherList />

            </div>
        </>
    )
}

export default Teachers