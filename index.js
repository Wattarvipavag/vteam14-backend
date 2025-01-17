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
import rentalRoutes from './routes/rentalRoute.js';
import resetRoutes from './routes/resetRoute.js';
import simulationRoutes from './routes/simulationRoute.js';
import { verifyToken } from './middleware/verifyFirebaseToken.js';

const app = express();
const PORT = process.env.PORT || 8000;

const MONGOURI = process.env.MONGOURI_PROD;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'test') {
    app.use('/api', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/cities', cityRoutes);
    app.use('/api/bikes', bikeRoutes);
    app.use('/api/chargingstations', chargingStationRoutes);
    app.use('/api/parkingareas', parkingAreaRoutes);
    app.use('/api/stats', statsRoutes);
    app.use('/api/rentals', rentalRoutes);
    app.use('/api/reset', resetRoutes);
    app.use('/api/simulation', simulationRoutes);
} else {
    app.use('/api', authRoutes);
    app.use('/api/users', verifyToken, userRoutes);
    app.use('/api/cities', verifyToken, cityRoutes);
    app.use('/api/bikes', verifyToken, bikeRoutes);
    app.use('/api/chargingstations', verifyToken, chargingStationRoutes);
    app.use('/api/parkingareas', verifyToken, parkingAreaRoutes);
    app.use('/api/stats', verifyToken, statsRoutes);
    app.use('/api/rentals', verifyToken, rentalRoutes);
    app.use('/api/reset', verifyToken, resetRoutes);
    app.use('/api/simulation', verifyToken, simulationRoutes);
}

export { app };

if (process.env.NODE_ENV !== 'test') {
    async function startServer() {
        try {
            await connectToDb(MONGOURI);

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
