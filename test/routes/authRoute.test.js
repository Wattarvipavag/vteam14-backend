import request from 'supertest';
import { app } from '../../index.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import User from '../../models/userModel.js';

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await User.create({
        name: 'Arja Hallonen',
        email: 'arja@hallonen.com',
        profileImage: 'https://example.com/hihi.jpg',
        oauthId: '1234',
    });
});

afterEach(async () => {
    await User.deleteMany();
});

describe('Auth Controller Tests', () => {
    describe('POST /api/login', () => {
        it('should login an existing user by oauthId', async () => {
            const response = await request(app).post('/api/login').send({ oauthId: '1234' });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('User already exists');
            expect(response.body.user).toHaveProperty('name', 'Arja Hallonen');
        });

        it('should register a new user if oauthId does not exist', async () => {
            const response = await request(app).post('/api/login').send({
                name: 'Chris P Bacon',
                email: 'chris@bacon.com',
                profileImage: 'https://example.com/hehe.jpg',
                oauthId: '5678',
            });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('New user created');
            expect(response.body.user).toHaveProperty('name', 'Chris P Bacon');
        });

        it('should return 500 if required fields are missing for registration', async () => {
            const response = await request(app).post('/api/login').send({
                oauthId: '5678',
            });

            expect(response.status).toBe(500);
            expect(response.body.message).toContain('validation');
        });
    });

    describe('POST /api/register', () => {
        it('should register a new user', async () => {
            const response = await request(app).post('/api/register').send({
                name: 'Chris P Bacon',
                email: 'chris@bacon.com',
                profileImage: 'https://example.com/hehe.jpg',
                oauthId: '5678',
            });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('New user created');
            expect(response.body.user).toHaveProperty('name', 'Chris P Bacon');
        });

        it('should return 500 if email is not provided', async () => {
            const response = await request(app).post('/api/register').send({
                name: 'Chris P Bacon',
                profileImage: 'https://example.com/hehe.jpg',
                oauthId: '5678',
            });

            expect(response.status).toBe(500);
            expect(response.body.message).toContain('validation');
        });
    });
});
