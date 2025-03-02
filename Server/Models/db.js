require('dotenv').config();

const mongoose = require('mongoose');

const mongo_url_a = process.env.MONGO_A_CONN;
const mongo_url_b = process.env.MONGO_B_CONN;

const connectionA = mongoose.createConnection(mongo_url_a);
const connectionB = mongoose.createConnection(mongo_url_b);

const mongoConnect = async () => {
    try {
        if (!mongo_url_a) {
            throw new Error('MongoDB connection string (MONGO_CONN) is not defined');
        }

        connectionA.on('connected', () => {
            console.log('Connected to MongoDB database A');
        });

        connectionB.on('connected', () => {
            console.log('Connected to MongoDB database B');
        });

        connectionA.on('error', (error) => {
            console.error('Database A connection error:', error);
        });

        connectionB.on('error', (error) => {
            console.error('Database B connection error:', error);
        });

    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = { mongoConnect, connectionA, connectionB };
