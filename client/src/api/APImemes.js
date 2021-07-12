const baseURL = "/api/v1";

async function getMemes() {
  const url = baseURL + "/memes";

  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => {
        response.json()
          .then((data) => {
            if (response.ok) {
              resolve(data.map((meme) => ({ ...meme })));
            } else {
              reject(data);
            }
          })
          .catch((err) => {
            reject({ error: "Cannot parse server response" });
          });
      })
      .catch((err) => {
        reject({ error: "Cannot communicate" });
      });
  });
};

async function addMeme(meme) {
  const url = baseURL + "/memes";
  const init = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(meme)
  };

  return new Promise((resolve, reject) => {
    fetch(url, init)
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          response.json()
            .then((obj) => {
              reject(obj);
            })
            .catch((err) => {
              reject({ error: "Cannot parse server response" });
            });
        }
      })
      .catch((err) => {
        reject({ error: "Cannot communicate" });
      });
  });
}

async function deleteMeme(meme) {
  const url = baseURL + "/memes/" + meme.id;
  const init = {
    method: "DELETE"
  };

  return new Promise((resolve, reject) => {
    fetch(url, init)
      .then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          response.json()
            .then((obj) => {
              reject(obj);
            })
            .catch((err) => {
              reject({ error: "Cannot parse server response" });
            });
        }
      })
      .catch((err) => {
        reject({ error: "Cannot communicate" });
      });
  });
}

const APImemes = { getMemes, addMeme, deleteMeme };
export default APImemes;
