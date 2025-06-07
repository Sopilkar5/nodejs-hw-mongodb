import mongoose from 'mongoose';

async function initMongoConnection() {
    try {
        const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;

        const connectionString = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

        await mongoose.connect(connectionString);
        if (mongoose.connection.readyState === 1) {
            console.log('Mongo connection successfully established!');
        } else {
            throw new Error('MongoDB connection not ready');
        }
    } catch (error) {
        console.error('Mongo connection error:', error);
        throw error;
    }
}

export { initMongoConnection };
