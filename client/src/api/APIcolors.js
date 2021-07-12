const baseURL = "/api/v1";

async function getColors() {
  const url = baseURL + "/colors";

  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => {
        response.json()
          .then((data) => {
            if (response.ok) {
              resolve(data.map((color) => ({ ...color })));
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

const APIcolors = { getColors };
export default APIcolors;
