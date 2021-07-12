'use strict';

const sqlite = require('sqlite3');

// Open the database
const db = new sqlite.Database("db.sqlite3", (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  console.log("Connected to the database");
});

db.serialize(() => {
  // Enable Foreign Key constraint
  db.run("PRAGMA foreign_keys = ON", (err) => {
    if (err) {
      console.error(err.message);
      throw err;
    }
    console.log("Foreign Key constraint is on");
  });
});

module.exports = db;
