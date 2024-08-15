import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { createMockStore, setupMockGetTeachersSvc, setupAllMockServices } from "../../utils/tests";
import { MemoryRouter } from "react-router-dom";
import TeacherList from "./TeacherList";

setupAllMockServices();

const mockTeachers = [
    { id: '1', name: 'John', middleName: 'A', surname: 'Doe', dob: new Date('2000-02-01'), address: '123 Main St', phoneNumber: '1234567890', email: 'zula@hotmail.com' },
    { id: '2', name: 'Jane', middleName: 'B', surname: 'Doe', dob: new Date('2000-02-01'), address: '456 Main St', phoneNumber: '0987654321', email: 'zula@hotmail.com' },
    { id: '3', name: 'Jim', middleName: 'C', surname: 'Beam', dob: new Date('2000-02-01'), address: '789 Main St', phoneNumber: '1122334455', email: 'zula@hotmail.com' },
    { id: '4', name: 'Jack', middleName: 'D', surname: 'Daniels', dob: new Date('2000-02-01'), address: '101 Main St', phoneNumber: '5566778899', email: 'zula@hotmail.com' },
    { id: '5', name: 'Johnny', middleName: 'E', surname: 'Walker', dob: new Date('2000-02-01'), address: '202 Main St', phoneNumber: '6677889900', email: 'zula@hotmail.com' }
];

const renderComponent = () => {
    const store = createMockStore({
        teachers: {
            teachers: mockTeachers,
            loading: false,
            fields: [],
            selectedTeacher: null,
            updateDisabled: true,
            teacherLoading: false,
        },
    });

    render(
        <Provider store={store}>
            <MemoryRouter>
                <TeacherList showFull={false} />
            </MemoryRouter>
        </Provider>
    );
};

describe('TeacherList component', () => {
    beforeEach(() => {
        setupMockGetTeachersSvc(mockTeachers);
    });

    test('Should show a list of 5 teachers on the dashboard', async () => {
        renderComponent();

        await waitFor(() => {
            const teacherRows = screen.getAllByRole('row');
            expect(teacherRows.length).toBe(6); // Including the header row
        });
    });

    test('Should render the correct teacher names', async () => {
        renderComponent();

        await waitFor(() => {
            mockTeachers.forEach((teacher) => {
                expect(screen.getByText(teacher.name)).toBeInTheDocument();
            });
        });
    });
})