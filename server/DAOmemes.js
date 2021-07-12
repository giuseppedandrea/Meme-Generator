'use strict';

const db = require('./db');

// Retrieve the list of all memes (authenticated user) or only public memes (unauthenticated user)
exports.listMemes = (isLoggedIn) => {
  return new Promise((resolve, reject) => {
    const sql = isLoggedIn ? "SELECT * FROM memes" : "SELECT * FROM memes WHERE isPublic = 1";

    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const memes = rows.map((row) => ({ ...row }));

      resolve(memes);
    });
  });
};

// Retrieve a meme, given its <id>
exports.getMeme = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM memes WHERE id = ?";
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row === undefined) {
        resolve(null);
        return;
      }

      const meme = { ...row };

      resolve(meme);
    });
  });
};

// Create a new meme, by providing all relevant information (except the <id>)
exports.createMeme = (meme) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO memes(templateId, userId, title, isPublic, fontId, colorId, text1, text2, text3) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.run(sql, [meme.templateId, meme.userId, meme.title, meme.isPublic, meme.fontId, meme.colorId, meme.text1, meme.text2, meme.text3], function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve(this.lastID);
    });
  });
};

// Delete an existing meme, given its <id>
exports.deleteMeme = (id, userId) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM memes WHERE id = ? AND userId = ?";
    db.run(sql, [id, userId], function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve(this.changes);
    });
  });
}
