'use strict';

const db = require('./db');

// Retrieve the list of all the available fonts
exports.listFonts = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM fonts";

    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const fonts = rows.map((row) => ({ ...row }));

      resolve(fonts);
    });
  });
};

// Retrieve the font, given its <id>
exports.getFont = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM fonts WHERE id = ?";
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row === undefined) {
        resolve(null);
        return;
      }

      const font = { ...row };

      resolve(font);
    });
  });
};
