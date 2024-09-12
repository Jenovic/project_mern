import React from 'react';
import { useDispatch } from 'react-redux';
import { getTeachersSvc, updateTeacherSvc, deleteTeacherSvc } from '../../services/teachers';
import { loadTeachers, updateTeacher, setLoading, setSelectedTeacher, setFields } from '../../slices/teacherSlice';
import { RootState } from '../../store';
import TeacherCard from './TeacherCard';
import EntityList from '../Entity/EntityList';

const TeacherList: React.FC<{ showFull: boolean }> = ({ showFull }) => {
    const dispatch = useDispatch();

    return (
        <EntityList
            entityName="Teacher"
            fetchSvc={getTeachersSvc}
            updateSvc={updateTeacherSvc}
            loadEntities={(teachers) => dispatch(loadTeachers(teachers))}
            updateEntity={updateTeacher}
            deleteSvc={deleteTeacherSvc}
            setEntityFields={(fields) => dispatch(setFields(fields))}
            setEntitySubFields={() => { }}
            setLoading={(loading) => dispatch(setLoading(loading))}
            setSelectedEntity={(teacher) => dispatch(setSelectedTeacher(teacher))}
            entitiesSelector={(state: RootState) => state.teachers.teachers}
            loadingSelector={(state: RootState) => state.teachers.loading}
            showFull={showFull}
            columns={[
                { label: 'Name', accessor: 'name' },
                { label: 'Middle Name', accessor: 'middleName' },
                { label: 'Surname', accessor: 'surname' },
                { label: 'Gender', accessor: 'gender' },
                { label: 'DOB', accessor: 'dob' },
                { label: 'Address', accessor: 'address' },
                { label: 'Phone No.', accessor: 'phoneNumber' },
                { label: 'Email', accessor: 'email' },
            ]}
            editComponent={TeacherCard}
        />
    );
};

export default TeacherList;
