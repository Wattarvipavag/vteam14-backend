import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectToDb } from './db/db.js';
import authRoutes from './routes/authRoute.js';
import userRoutes from './routes/userRoute.js';
import cityRoutes from './routes/cityRoute.js';
import bikeRoutes from './routes/bikeRoute.js';
import chargingStationRoutes from './routes/chargingStationRoute.js';
import parkingAreaRoutes from './routes/parkingAreaRoute.js';
import statsRoutes from './routes/statsRoute.js';

const app = express();
const PORT = process.env.PORT || 8000; // Default port is 8000 if not defined

const MONGOURI = process.env.MONGOURI_PROD;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/bikes', bikeRoutes);
app.use('/api/chargingstations', chargingStationRoutes);
app.use('/api/parkingareas', parkingAreaRoutes);
app.use('/api/stats', statsRoutes);

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
