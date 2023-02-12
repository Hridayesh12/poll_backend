const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const db = process.env.CONN_STRING;
const connectDb = async () => {
    try {
        const conn = await mongoose.connect(db);
        console.log(`MongoDb connected ${conn.connection.host}`);
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
}
module.exports = { connectDb, db };