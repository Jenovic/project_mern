import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { createMockStore, setupMockGetStudentsSvc, setupAllMockServices } from "../../utils/tests";
import { MemoryRouter } from "react-router-dom";
import StudentList from "./StudentList";

// Setup the mock services
setupAllMockServices();

export const mockStudents = [
    { id: '1', name: 'John', middleName: 'A', surname: 'Doe', dob: new Date('2000-02-01'), address: '123 Main St', phoneNumber: '1234567890', responsables: [] },
    { id: '2', name: 'Jane', middleName: 'B', surname: 'Doe', dob: new Date('2000-02-01'), address: '456 Main St', phoneNumber: '0987654321', responsables: [] },
    {
        id: '3', name: 'Jim', middleName: 'C', surname: 'Beam', dob: new Date('2000-02-01'), address: '789 Main St', phoneNumber: '1122334455', responsables: [{
            "name": "Noble",
            "middleName": "Adan",
            "surname": "Weber",
            "phoneNumber": "(661) 774-0091 x2044",
            "address": "893 Newton Road",
            "email": "Ike18@gmail.com",
            "relationshipToStudent": "Parent",
            "_id": "66598d876191e0eae9d5ce70"
        }]
    },
    { id: '4', name: 'Jack', middleName: 'D', surname: 'Daniels', dob: new Date('2000-02-01'), address: '101 Main St', phoneNumber: '5566778899', responsables: [] },
    { id: '5', name: 'Johnny', middleName: 'E', surname: 'Walker', dob: new Date('2000-02-01'), address: '202 Main St', phoneNumber: '6677889900', responsables: [] }
];

const renderComponent = () => {
    const store = createMockStore({
        students: {
            students: mockStudents,
            loading: false,
            fields: [],
            selectedStudent: null,
            responsibleFields: [],
            updateDisabled: true,
            studentLoading: false,
        },
    });

    render(
        <Provider store={store}>
            <MemoryRouter>
                <StudentList showFull={false} />
            </MemoryRouter>
        </Provider>
    );
};

describe('StudentList component', () => {
    beforeEach(() => {
        setupMockGetStudentsSvc(mockStudents);
        renderComponent();
    });

    test('Should show a list of 5 students on the dashboard', async () => {
        await waitFor(() => {
            const studentRows = screen.getAllByRole('row');
            expect(studentRows.length).toBe(6); // Including the header row
        });
    });

    test('Should render the correct student names', async () => {
        await waitFor(() => {
            mockStudents.forEach((student) => {
                expect(screen.getByText(student.name)).toBeInTheDocument();
            });
        });
    });
});
