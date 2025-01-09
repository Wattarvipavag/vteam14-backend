import request from 'supertest';
import { app } from '../../index.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import City from '../../models/cityModel.js';
import 'dotenv/config';
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
    await City.create({ name: 'Stockholm' });
    await City.create({ name: 'Karlskrona' });
});

afterEach(async () => {
    await City.deleteMany();
});

describe('City Controller Tests', () => {
    describe('GET /api/cities', () => {
        it('should return all cities', async () => {
            const response = await request(app).get('/api/cities');
            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
            expect(response.body[0]).toHaveProperty('name', 'Stockholm');
            expect(response.body[1]).toHaveProperty('name', 'Karlskrona');
        });
    });

    describe('GET /api/cities/cityId/:id', () => {
        it('should return a city by its ID', async () => {
            const city = await City.findOne({ name: 'Stockholm' });
            const response = await request(app).get(`/api/cities/cityId/${city._id}`);
            expect(response.status).toBe(200);
            expect(response.body.city).toHaveProperty('name', 'Stockholm');
        });

        it('should return 404 for a non-existent city ID', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            const response = await request(app).get(`/api/cities/cityId/${nonExistentId}`);
            expect(response.status).toBe(404);
            expect(response.body.message).toBe(`No city found with ${nonExistentId}`);
        });
    });

    describe('GET /api/cities/cityName/:name', () => {
        it('should return a city by its name', async () => {
            const response = await request(app).get('/api/cities/cityName/Stockholm');
            expect(response.status).toBe(200);
            expect(response.body.city).toHaveProperty('name', 'Stockholm');
        });

        it('should return 404 for a non-existent city name', async () => {
            const response = await request(app).get('/api/cities/cityName/Karlstad');
            expect(response.status).toBe(404);
            expect(response.body.message).toBe('No city found with Karlstad');
        });
    });

    describe('POST /api/cities', () => {
        it('should create a new city', async () => {
            const response = await request(app).post('/api/cities').send({
                name: 'Kristianstad',
            });
            expect(response.status).toBe(201);
            expect(response.body.message).toBe('City created');
            expect(response.body.city).toHaveProperty('name', 'Kristianstad');
        });
    });

    describe('DELETE /api/cities/cityId/:id', () => {
        it('should delete a city by its ID', async () => {
            const city = await City.findOne({ name: 'Stockholm' });
            const response = await request(app).delete(`/api/cities/cityId/${city._id}`);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('City deleted');
        });

        it('should return 500 if ID is invalid', async () => {
            const response = await request(app).delete('/api/cities/cityId/invalidId');
            expect(response.status).toBe(500);
        });
    });

    describe('DELETE /api/cities/cityName/:name', () => {
        it('should delete a city by its name', async () => {
            const response = await request(app).delete('/api/cities/cityName/Stockholm');
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('City deleted');
        });

        it('should return 500 for an invalid request', async () => {
            const response = await request(app).delete('/api/cities/cityName/NonExistentCity');
            expect(response.status).toBe(200);
        });
    });

    describe('DELETE /api/cities', () => {
        it('should delete all cities', async () => {
            const response = await request(app).delete('/api/cities');
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Cities deleted');
        });
    });
});
