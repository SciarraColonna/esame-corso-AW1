import sqlite from "sqlite3";

const database_path = "./db/"
const db = new sqlite.Database(database_path + "db.db", (err) => {
    if (err) {
        throw err;
    }
});

export default db;