import mongoose from 'mongoose';

export async function connectToDb() {
    const env = process.env.NODE_ENV || 'production';
    const dbURI =
        env === 'test' ? process.env.MONGOURI_TEST : process.env.MONGOURI_PROD;

    try {
        await mongoose.connect(dbURI);
        console.log(`Connected to ${env} database`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

export async function closeDb() {
    await mongoose.connection.close();
}
