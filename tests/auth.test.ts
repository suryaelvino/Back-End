import request from 'supertest';
import { app } from '../index';
import { Connection } from "../src/models/database";
const db = new Connection();
db.connect()
// Mock up data pengguna untuk pengujian
const mockUser = {
    email: 'suryamohamad99@gmail.com',
    password: '123456789',
};

describe('POST /api/login', () => {
    beforeAll(async () => {
        await db.connect();
        console.log('Database testing connected');
    });
    it('should return 200 if success login', async () => {
        const response = await request(app).post('/api/login').send(mockUser).expect(200);
        expect(response.body.message).toBe('success login');
    });

    it('should return 400 if email or password is missing', async () => {
        const emptyUser = {
            email: '',
            password: '',
        };
        const response = await request(app).post('/api/login').send({}).expect(400);
        expect(response.body.message).toBe('Email and password are required');
    });

    it('should return 404 for incorrect email', async () => {
        const incorrectPasswordUser = {
            email: "wrongemail",
            password: mockUser.password,
        };

        const response = await request(app)
            .post('/api/login')
            .send(incorrectPasswordUser)
            .expect(404);

        expect(response.body.message).toBe('Please check email and password is correct');
    });

    it('should return 404 for incorrect password', async () => {
        const incorrectPasswordUser = {
            email: mockUser.email,
            password: 'wrongpassword',
        };

        const response = await request(app)
            .post('/api/login')
            .send(incorrectPasswordUser)
            .expect(404);

        expect(response.body.message).toBe('Please check email and password is correct');
    });

});