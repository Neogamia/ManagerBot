import sqlite3 from "sqlite3";

const db = new sqlite3.Database('../../databases/manager.sqlite', sqlite3.OPEN_READWRITE, (err) => {
    if(err) return console.log(err.message);
});

export async function execute(sql) {
    db.run(sql, (err) =>  {
        if(err) return console.log(err.message);
    });
    db.close();
}

export async function readfromdb(sql) {
    let res = db.all(sql, (err) => {
        if(err) return console.error(err.message);
    });
    db.close();
    return console.log(res);
}