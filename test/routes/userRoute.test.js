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
    await User.create({ name: 'Arja Hallonen', email: 'arja@hallonen.com', oauthId: '1234' });
    await User.create({ name: 'Chris P Bacon', email: 'chris@bacon.com', oauthId: '5678' });
});

afterEach(async () => {
    await User.deleteMany();
});

describe('User Routes Tests', () => {
    it('GET /api/users - should return all users', async () => {
        const response = await request(app).get('/api/users');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
        expect(response.body[0]).toHaveProperty('name', 'Arja Hallonen');
        expect(response.body[1]).toHaveProperty('name', 'Chris P Bacon');
    });

    it('GET /api/users/:id - should return a user by ID', async () => {
        const user = await User.findOne({ name: 'Arja Hallonen' });
        const response = await request(app).get(`/api/users/${user._id}`);
        expect(response.status).toBe(200);
        expect(response.body.user).toHaveProperty('name', 'Arja Hallonen');
    });

    it('GET /api/users/:id - should return 404 for non-existent user', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const response = await request(app).get(`/api/users/${nonExistentId}`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe(`No user found with ${nonExistentId}`);
    });

    it('GET /api/users/oauth/:id - should return a user by oauth ID', async () => {
        const response = await request(app).get('/api/users/oauth/1234');
        expect(response.status).toBe(200);
        expect(response.body.user).toHaveProperty('name', 'Arja Hallonen');
    });

    it('GET /api/users/oauth/:id - should return 404 for non-existent oauth ID', async () => {
        const response = await request(app).get('/api/users/oauth/nonexistent');
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('No user found with oauth id: nonexistent');
    });
});
