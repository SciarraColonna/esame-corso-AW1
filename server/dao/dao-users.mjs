import db from "./db.mjs";
import crypto from "crypto";


export default function UserDao () {

    this.getUserByCredentials = (username, password) => {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM users WHERE username=?";
            db.get(query, [username], (err, row) => {
                console.log(row);
                if (err) {
                    reject(err);
                } else if (row === undefined) {
                    resolve(false);
                } else {
                    const user = { id: row.id, username: row.username }

                    crypto.scrypt(password, row.salt, 32, (err, hashedPsw) => {
                        if (err) {
                            reject(err);
                        } 
                        if (!crypto.timingSafeEqual(Buffer.from(row.hash, "hex"), hashedPsw)) {
                            resolve(false);
                        } else {
                            resolve(user);
                        }
                    });
                }
            });
        });
    }
}