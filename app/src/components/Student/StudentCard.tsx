import React, { useState } from 'react';
import FormModal from '../Modal/FormModal';
import StudentForm from './StudentForm';

const StudentCard = ({ student }: any) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(student);

    const handleEditClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleFormSubmit = (updatedStudent: any) => {
        setSelectedStudent(updatedStudent);
        setShowModal(false);
        // Add logic to update the student data in your state/store
    };

    return (
        <div>
            <div className="border p-4 rounded">
                <h2 className="text-xl font-bold">{student.name}</h2>
                <p>Middle Name: {student.middleName}</p>
                <p>Surname: {student.surname}</p>
                <p>Date of Birth: {new Date(student.dob).toLocaleDateString()}</p>
                <p>Address: {student.address}</p>
                <p>Phone Number: {student.phoneNumber}</p>
                <button
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                    onClick={handleEditClick}
                >
                    Edit
                </button>
            </div>
            <FormModal show={showModal} onClose={handleCloseModal}>
                <StudentForm student={selectedStudent} onSubmit={handleFormSubmit} />
            </FormModal>
        </div>
    );
};

export default StudentCard;
