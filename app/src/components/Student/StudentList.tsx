import React from 'react';
import { useDispatch } from 'react-redux';
import { getStudentsSvc, updateStudentSvc, deleteStudentSvc } from '../../services/students';
import { loadStudents, setLoading, setSelectedStudent, setFields, setResponsibleFields, updateStudent } from '../../slices/studentSlice';
import { RootState } from '../../store';
import StudentCard from './StudentCard';
import EntityList from '../Entity/EntityList';

const StudentList: React.FC<{ showFull: boolean }> = ({ showFull }) => {
    const dispatch = useDispatch();

    return (
        <EntityList
            entityName="Student"
            fetchSvc={getStudentsSvc}
            updateSvc={updateStudentSvc}
            loadEntities={(students) => dispatch(loadStudents(students))}
            updateEntity={updateStudent}
            deleteSvc={deleteStudentSvc}
            setEntityFields={(fields) => dispatch(setFields(fields))}
            setEntitySubFields={(fields) => dispatch(setResponsibleFields(fields))}
            setLoading={(loading) => dispatch(setLoading(loading))}
            setSelectedEntity={(student) => dispatch(setSelectedStudent(student))}
            entitiesSelector={(state: RootState) => state.students.students}
            loadingSelector={(state: RootState) => state.students.loading}
            showFull={showFull}
            columns={[
                { label: 'Name', accessor: 'name' },
                { label: 'Middle Name', accessor: 'middleName' },
                { label: 'Surname', accessor: 'surname' },
                { label: 'Gender', accessor: 'gender' },
                { label: 'DOB', accessor: 'dob' },
                { label: 'Address', accessor: 'address' },
                { label: 'Phone No.', accessor: 'phoneNumber' },
                { label: 'Responsibles', accessor: 'responsables' },
            ]}
            editComponent={StudentCard}
        />
    );
};

export default StudentList;

