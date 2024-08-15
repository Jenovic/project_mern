import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { setLoading, updateStudent, setSelectedStudent } from "../../slices/studentSlice";
import { createMockStore, setupAllMockServices } from "../../utils/tests";
import { mockStudents } from "../Student/Students.test";
import EntityCard from "./EntityCard";

// Setup the mock services
setupAllMockServices();

const store = createMockStore({
    students: {
        students: mockStudents,
        loading: false,
        fields: [],
        selectedStudent: mockStudents[2],
        responsibleFields: [],
        updateDisabled: true,
        studentLoading: false,
    }
})

describe('EntityCard component', () => {
    beforeEach(() => {
        render(
            <Provider store={store}>
                <EntityCard
                    entityName="Student"
                    updateSvc={jest.fn()}
                    updateEntity={updateStudent}
                    setLoading={setLoading}
                    setSelectedEntity={setSelectedStudent}
                    selectedEntity={store.getState().students.selectedStudent}
                    fields={store.getState().students.fields}
                />
            </Provider>
        )
    })
    test('Should not delete a responsable if there is only one responsable for a student', () => {
        // Ensure the student has only one responsable initially
        const { responsables } = store.getState().students.selectedStudent;
        expect(responsables.length).toBeGreaterThanOrEqual(1);

        const deleteBtn = screen.getByTestId('delete');
        fireEvent.click(deleteBtn);
    })
})