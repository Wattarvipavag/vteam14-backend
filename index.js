import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectToDb } from './db/db.js';

const app = express();
const PORT = process.env.PORT || 8000; // Default port is 8000 if not defined

const MONGOURI = process.env.NODE_ENV === 'test' ? process.env.MONGOURI_TEST : process.env.MONGOURI_PROD;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ message: 'Hello world!' });
});

// Export app for testing
export { app };

// Only start the server if not in a test environment
if (process.env.NODE_ENV !== 'test') {
    async function startServer() {
        try {
            await connectToDb(MONGOURI); // Use appropriate Mongo URI for the environment

            app.listen(PORT, () => {
                console.log(`App running on port ${PORT}`);
            });
        } catch (error) {
            console.error('Failed to connect to the database:', error);
            process.exit(1);
        }
    }

    startServer();
}
