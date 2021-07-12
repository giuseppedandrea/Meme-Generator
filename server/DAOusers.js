'use strict';

const db = require('./db');
const bcrypt = require('bcrypt');

// Retrieve the user, given its <username> and <password>
exports.getUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE username = ?";
    db.get(sql, [username], (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row === undefined) {
        resolve(null);
        return;
      }

      const user = { id: row.id, username: row.username, name: row.name };

      bcrypt.compare(password, row.passwordHash).then(result => {
        if (result) {
          resolve(user);
        } else {
          resolve(null);
        }
      });
    });
  });
};

// Retrieve the user, given its <id>
exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row === undefined) {
        resolve(null);
        return;
      }

      const user = { id: row.id, username: row.username, name: row.name }

      resolve(user);
    });
  });
};

// Retrieve the list of all the available names
exports.listNames = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id, name FROM users";

    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const names = rows.map((row) => ({ ...row }));

      resolve(names);
    });
  });
};
