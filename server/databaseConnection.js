const mongoose = require('mongoose');

function DbConnection() {
    const DB_URL = process.env.MONGO_URL || process.env.MONGO_URI;
    if (!DB_URL) {
        throw new Error("Missing MongoDB connection string. Set MONGO_URI (or MONGO_URL) in server/.env");
    }

    mongoose.connect(DB_URL)

    const db = mongoose.connection;

    db.on("error", console.error.bind(console, "Connection Error"))
    db.once("open", function(){
        console.log("DB Connected...")
    })
}

module.exports = DbConnection;
