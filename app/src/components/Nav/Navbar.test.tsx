import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { createMockStore } from "../../utils/tests";
import Navbar from "./Navbar";


describe('Navbar component', () => {
    test('Should show the logo in the nav bar on initial load', () => {

        const store = createMockStore({
            auth: {
                token: '',
                isAuthenticated: false,
                user: null,
            },
        });

        render(
            <Provider store={store}>
                <Navbar />
            </Provider>
        );
        expect(screen.getByAltText('Logo')).toBeInTheDocument();
    });

    test('Should show the user account dropdown once a user is logged in', () => {
        const store = createMockStore({
            auth: {
                token: '',
                isAuthenticated: true,
                user: { name: 'John Doe', email: 'john@example.com' },
            }
        });

        render(
            <Provider store={store}>
                <Navbar />
            </Provider>
        );

        const dropdownIcon = screen.getByTestId('dropdownNavMenu');
        expect(dropdownIcon).toBeInTheDocument();

    });

    test('Should show the dropdown content when the user icon is clicked on the Navbar', () => {
        const store = createMockStore({
            auth: {
                token: '',
                isAuthenticated: true,
                user: { name: 'John Doe', email: 'john@example.com' },
            }
        });

        render(
            <Provider store={store}>
                <Navbar />
            </Provider>
        );

        const dropdownIcon = screen.getByTestId('dropdownNavMenu');
        fireEvent.click(dropdownIcon);

        expect(screen.getByText('John Doe')).toBeVisible();
        expect(screen.getByText('john@example.com')).toBeVisible();
    })
})
