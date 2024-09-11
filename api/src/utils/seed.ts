import Student, { IStudent } from '../models/Student';
import Teacher, { ITeacher } from '../models/Teacher';
import { faker } from '@faker-js/faker';
import mongoose, { ConnectOptions } from "mongoose";
import StudentModel from '../models/Student';
import TeacherModel from '../models/Teacher';
const config = require('config');

const db = config.get('mongoURI');

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as ConnectOptions);

const generateMockStudent = (): IStudent => {
    const mockStudent = new StudentModel({
        gender: faker.helpers.arrayElement(['male', 'female']),
        name: faker.person.firstName(),
        middleName: faker.person.firstName(),
        surname: faker.person.lastName(),
        dob: faker.date.birthdate({ min: 1990, max: 2010, mode: 'year' }),
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
                relationshipToStudent: faker.helpers.arrayElement(['father', 'mother', 'sibling', 'relative', 'sponsor']),
            },
            {
                address: faker.location.streetAddress(),
                email: faker.internet.email(),
                name: faker.person.firstName(),
                middleName: faker.person.firstName(),
                surname: faker.person.lastName(),
                phoneNumber: faker.phone.number(),
                relationshipToStudent: faker.helpers.arrayElement(['father', 'mother', 'sibling', 'relative', 'sponsor']),
            },
        ],
        class: faker.database.mongodbObjectId(), // Mock class ObjectId
        location: faker.database.mongodbObjectId(), // Mock location ObjectId
        status: 'approved',
        dateCreated: faker.date.recent(),
        dateModified: faker.date.recent(),
    });
    return mockStudent;
};

const generateMockTeacher = (): ITeacher => {
    const mockTeacher = new TeacherModel({
        gender: faker.helpers.arrayElement(['male', 'female']),
        name: faker.person.firstName(),
        middleName: faker.person.firstName(),
        surname: faker.person.lastName(),
        dob: faker.date.birthdate({ min: 1960, max: 2000, mode: 'year' }),
        address: faker.location.streetAddress(),
        phoneNumber: faker.phone.number(),
        email: faker.internet.email(),
        class: faker.database.mongodbObjectId(), // Mock class ObjectId
        location: faker.database.mongodbObjectId(), // Mock location ObjectId
        status: 'approved',
        dateCreated: faker.date.recent(),
        dateModified: faker.date.recent(),
    });
    return mockTeacher;
};

const seedDatabase = async () => {
    try {
        // Clear existing data
        await Student.deleteMany({});
        await Teacher.deleteMany({});

        // Generate and insert mock students
        const numSample = 15; // Change this number to generate more or fewer students
        const students: IStudent[] = Array.from({ length: numSample }, generateMockStudent);
        const teachers: ITeacher[] = Array.from({ length: numSample }, generateMockTeacher);
        await Student.create(students);
        await Teacher.create(teachers);

        console.log('Database seeded successfully');
        mongoose.disconnect();
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDatabase();
