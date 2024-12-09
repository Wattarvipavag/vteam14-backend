/* import request from 'supertest';
import { app } from '../../index.js'; // Import app directly
import { MongoMemoryServer } from 'mongodb-memory-server';

jest.mock('../../db/db.js', () => ({
    connectToDb: jest.fn().mockResolvedValue(true),
}));

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

describe('Express Server Tests', () => {
    it('should respond with a "Hello world!" message on the root endpoint', async () => {
        const response = await request(app).get('/'); // Use `app` directly
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Hello world!');
    });
});
 */