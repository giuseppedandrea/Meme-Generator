'use strict';

const db = require('./db');

// Retrieve the list of all the available templates
exports.listTemplates = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM templates";

    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const templates = rows.map((row) => ({ ...row }));

      resolve(templates);
    });
  });
};

// Retrieve the template, given its <id>
exports.getTemplate = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM templates WHERE id = ?";
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row === undefined) {
        resolve(null);
        return;
      }

      const template = { ...row };

      resolve(template);
    });
  });
};
