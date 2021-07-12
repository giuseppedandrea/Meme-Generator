'use strict';

const db = require('./db');

// Retrieve the list of all the available colors
exports.listColors = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM colors";

    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const colors = rows.map((row) => ({ ...row }));

      resolve(colors);
    });
  });
};

// Retrieve the color, given its <id>
exports.getColor = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM colors WHERE id = ?";
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row === undefined) {
        resolve(null);
        return;
      }

      const color = { ...row };

      resolve(color);
    });
  });
};
