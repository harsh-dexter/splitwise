const mongoose = require('mongoose');

async function connectDB(mongoUri) {
    try {
        const connection = await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${connection.connection.host}`);
        return connection;
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
}

module.exports = { connectDB };


