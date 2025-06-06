const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log(`\nMongoDB Connected to ${process.env.DB_NAME} DB \nHOST: ${conn.connection.host}`);
    } catch (error) {
        console.log("MongoDB Connection Failed",error);
        process.exit(1);
    }
}

module.exports = connectDB;