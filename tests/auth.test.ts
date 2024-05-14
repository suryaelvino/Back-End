import request from 'supertest';
import { app } from '../index';
import { Connection } from "../src/connection/database";
const db = new Connection();
db.connect()

const mockUser = {
    email: 'suryamohamad99@gmail.com',
    password: '123456789',
};

describe('POST /api/login', () => {
    beforeAll(async () => {
        await db.connect();
        console.log('Database testing connected');
    });

    test('should return 200 if success login', async () => {
        const response = await request(app).post('/api/login').send(mockUser).expect(200);
        expect(response.body.message).toBe('success login');
    });

    test('should return 400 if email or password is missing', async () => {
        const response = await request(app).post('/api/login').send({}).expect(400);
        expect(response.body.message).toBe('Email and password are required');
    });

    test('should return 404 for incorrect email', async () => {
        const incorrectPasswordUser = {
            email: "wrongemail",
            password: mockUser.password,
        };
        const response = await request(app).post('/api/login').send(incorrectPasswordUser).expect(404);
        expect(response.body.message).toBe('Please check email and password is correct');
    });

    test('should return 404 for incorrect password', async () => {
        const incorrectPasswordUser = {
            email: mockUser.email,
            password: 'wrongpassword',
        };
        const response = await request(app).post('/api/login').send(incorrectPasswordUser).expect(404);
        expect(response.body.message).toBe('Please check email and password is correct');
    });
});