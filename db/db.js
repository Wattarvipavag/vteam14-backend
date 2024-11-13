import mongoose from 'mongoose';

export async function connectToDb() {
    let dbURI = process.env.MONGO_URI;

    try {
        await mongoose.connect(dbURI);
        console.log('Connected to database');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}
