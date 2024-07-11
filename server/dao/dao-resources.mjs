import db from "./db.mjs";

function ResourceDao () {
    this.getImages = (quantity) => {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM images ORDER BY RANDOM() LIMIT ?";
            db.all(query, [quantity], (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        });
    }

    this.getCaptions = (id) => {
        return new Promise((resolve, reject) => {
            const query_1 = "SELECT DISTINCT memes.captionId, captions.content, 1 AS correct " + 
                            "FROM memes, captions "                                            +
                            "WHERE memes.captionId = captions.id AND imageId=? "               +
                            "ORDER BY RANDOM() "                                               +
                            "LIMIT 2";
            const query_2 = "SELECT DISTINCT memes.captionId, captions.content, 0 AS correct " +
                            "FROM memes, captions "                                            +
                            "WHERE memes.captionId = captions.id AND memes.imageId!=? AND memes.captionId NOT IN (SELECT captionId FROM memes WHERE imageID=?) " + 
                            "ORDER BY RANDOM() "                                               +
                            "LIMIT 5";
            const response = [];

            db.all(query_1, [id], (err, rows) => {
                if (err) {
                    reject(err);
                }
                response.push(...rows);
                db.all(query_2, [id, id], (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    response.push(...rows);
                    resolve(response);
                });
            });
        });
    }

    this.storeMatchData = (data) => {
        return new Promise((resolve, reject) => {
            let successes = 0;
            const query = "INSERT INTO history (userId, imageId, score) VALUES (?, ?, ?)";
            data.forEach((round) => {
                db.run(query, [round.userId, round.imageId, round.score], (err) => {
                    if(err) {
                        console.log(err);
                        reject(err);
                    }

                    successes++;
                    if (successes === 3) {
                        resolve(true);
                    }
                });
            });
        });
    }

    this.getMatchData = (id) => {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM history WHERE userId=?";
            db.all(query, [id], (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        });
    }
}


export default ResourceDao;