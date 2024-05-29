import Student, { IStudent } from '../models/Student';
import { faker } from '@faker-js/faker';
import mongoose, { ConnectOptions } from "mongoose";
import StudentModel from '../models/Student';
const config = require('config');

const db = config.get('mongoURI');

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as ConnectOptions);

const generateMockStudent = (): IStudent => {
    const mockStudent = new StudentModel({
        name: faker.person.firstName(),
        middleName: faker.person.firstName(),
        surname: faker.person.lastName(),
        dob: faker.date.birthdate(),
        address: faker.location.streetAddress(),
        phoneNumber: faker.phone.number(),
        responsables: [
            {
                address: faker.location.streetAddress(),
                email: faker.internet.email(),
                name: faker.person.firstName(),
                middleName: faker.person.firstName(),
                surname: faker.person.lastName(),
                phoneNumber: faker.phone.number(),
                relationshipToStudent: 'Parent',
            },
        ],
        date: faker.date.past(),
    });
    return mockStudent;
};

const seedDatabase = async () => {
    try {
        // Clear existing data
        await Student.deleteMany({});

        // Generate and insert mock students
        const numStudents = 15; // Change this number to generate more or fewer students
        const students: IStudent[] = Array.from({ length: numStudents }, generateMockStudent);
        await Student.create(students);

        console.log('Database seeded successfully');
        mongoose.disconnect();
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDatabase();
