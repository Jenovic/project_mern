import React from 'react';
import { useDispatch } from 'react-redux';
import { getClassroomsSvc, updateClassroomSvc, deleteClassroomSvc } from '../../services/classrooms';
import { loadClassrooms, updateClassroom, setLoading, setSelectedClassroom, setFields } from '../../slices/classroomSlice';
import { RootState } from '../../store';
import EntityList from '../Entity/EntityList';
import ClassroomCard from './ClassroomCard';

const ClassroomList: React.FC<{ showFull: boolean }> = ({ showFull }) => {
    const dispatch = useDispatch();

    return (
        <EntityList
            entityName='Classroom'
            fetchSvc={getClassroomsSvc}
            updateSvc={updateClassroomSvc}
            loadEntities={(classrooms) => dispatch(loadClassrooms(classrooms))}
            updateEntity={updateClassroom}
            deleteSvc={deleteClassroomSvc}
            setEntityFields={(fields) => dispatch(setFields(fields))}
            setEntitySubFields={() => { }}
            setLoading={(loading) => dispatch(setLoading(loading))}
            setSelectedEntity={(classroom) => dispatch(setSelectedClassroom(classroom))}
            entitiesSelector={(state: RootState) => state.classrooms.classrooms}
            loadingSelector={(state: RootState) => state.classrooms.loading}
            showFull={showFull}
            columns={[
                { label: 'Name', accessor: 'name' },
                { label: 'Location', accessor: 'location' },
            ]}
            editComponent={ClassroomCard}
        />
    )
};

export default ClassroomList;