import request from 'supertest';
import { app } from '../../index.js'; // Import app directly

jest.mock('../../db/db.js', () => ({
    connectToDb: jest.fn().mockResolvedValue(true),
}));

describe('Express Server Tests', () => {
    it('should respond with a "Hello world!" message on the root endpoint', async () => {
        const response = await request(app).get('/'); // Use `app` directly
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Hello world!');
    });
});
